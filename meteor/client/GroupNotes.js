var Universities = new Meteor.Collection("universities");
var Professors = new Meteor.Collection("professors");
var Classes = new Meteor.Collection("classes");
var Chats = new Meteor.Collection("chats");
var Documents = new Meteor.Collection("documents");

Router.configure({
  autoRender: false,
  notFoundTemplate: 'notFound',
});

console.log('running');

Router.map(function () {
  this.route('home', {
    path: '/',
  });

  this.route('home-user', {
    path: '/home-user',
  });

  this.route('contact', {
    path: '/contact',
  });

  this.route('about-us', {
    path: '/about-us',
    template: 'about_us',
  });

  this.route('note', {
    path: '/note',
    template: 'note',
  });

  this.route('noteNotFound', {
    path: '/noteNotFound',
    template: 'noteNotFound',
  });

  this.route('chat', {
    path: '/chat',
  });
  
  this.route('search', {
    path: '/search',
    template: 'search',
  });
  
});

if (Meteor.user()) {
  var email = Meteor.user().emails[0].address
  amplify.store('name', email.split("@")[0]);
} else {
  if (!amplify.store('name')) {
    Meteor.call("getPseudoName", function(error, name) {
      console.log(name);
      amplify.store('name', 'Anonymous ' + name);
    });
  }
}

var scrollChatToBottom = function() {
  var elem = document.getElementById('chat-messages');
  if (elem) {
    elem.scrollTop = elem.scrollHeight;
  }
}

Template.chat.chat = function () {
  var cursor = Chats.find({});
  cursor.observe({
    added : scrollChatToBottom
  });
  return cursor;
}

Template.chat.rendered = function () {
  scrollChatToBottom();
}

Template.chat.events({
  'keypress #chat-input' : function (evt) {
    if (evt.which === 13) {
      var text = $('#chat-input').val();
      setTimeout("$('#chat-input').val('');", 50);
      Meteor.call("postChat", amplify.store('name'), text);
    }
  }
});

Template.search.events({
  
  'click #searchsubmit' : function (evt) {
     Session.set("searchitem", $("#search").val());
  }
});
/*
Template.search.search = function () {
  
  var searchitem = Session.get("searchitem");
  var terms = searchitem.split(" ");
  var docsquery = [];
  
  terms.forEach(function(element, index, array)
  {
    docsquery.push({"snapshot" : element});
 
  });
  
  var docsSearch = db.docs.find({$or : docsquery});
  
  return docsSearch;
  
}*/

Template.search.searchTitle = function () {
  
  var searchitem = new String(Session.get("searchitem"));
  var terms = searchitem.split(" ");
  var documentquery = [];
  
  terms.forEach(function(element, index, array)
  {
    documentquery.push(element);
 
  });
  
//  console.log(documentquery);
  
  //var documentsSearch = db.documents.find({'title' : {$all : documentquery}}).fetch();
  
//  return documentsSearch;
}


Template.addClass.rendered = function() {
  $( "#addClass" ).dialog({
    autoOpen: false,
    draggable: false,
    resizable: false,
    buttons: {
      "Create": function() {
          Classes.insert( {
            'name' : $('#ac_name').val(),
            'description' : $('#ac_description').val(),
            'university' : new Meteor.Collection.ObjectID(amplify.store('university'))
          });
          $( this ).dialog( "close" );
      },
      "Cancel": function() {
        $( this ).dialog( "close" );
      }
    },
  });
}

Template.addProfessor.rendered = function() {
  $( "#addProfessor" ).dialog({
    draggable: false,
    resizable: false,
    autoOpen: false,
    height: 300,
    width: 350,
    height: 325,
    modal: true,
    buttons: {
      "Create": function() {
          $( this ).dialog( "close" );
      },
      Cancel: function() {
        $( this ).dialog( "close" );
      }
    },
    close: function() {
    }
  });
}

Template.noteFinder.universities = function (today) {
  return Universities.find();
};

Template.noteFinder.events = {
  'click input[name="notes"]': function() {
    Session.set('university', amplify.store('university'));
    Session.set('class', $('#class').val());

    var note = Documents.findOne({class : $('#class').val()});    
    var noteID;

    if (!note) { // no note exists
      noteID = createNote();
      noteUpdated(noteID);
    } else {
      noteID = note._id;
    }

    window.location = '/note?id=' + noteID;
  }
};

Template.noteFinder.rendered = function() {
  var university_name = amplify.store('university-name');
  console.log(amplify.store('university'));
  if (!(amplify.store('university'))) {
    console.log('hello');
    //$('#teacher').select2("enable", false);
    $('#class').attr('disabled', 'disabled');
    $('#class').select2("enable", false);
  }
  $('#university').attr('placeholder', university_name);

  $('#university').select2({
      dropDownCssClass: 'noteFinderDrop',
      placeholder: amplify.store('university') ? amplify.store('university') : 'university',
      query: function (query) {
          var data = {results: []}, i, j, s;
          var regex = new RegExp(query.term, 'i');
          var univlist;

          univlist = Universities.find({$or : [{'name' : regex}, {'acronym' : regex}] }).fetch();
	  
	  univlist.forEach(function(element, index, array)
	  {
	    var id = element._id._str;
	    var acr = element.acronym;
	    acr.forEach(function(acrelement, acrindex, acrarray)
	    {
	      var school = {};
	      school.id = id;
	      school.text = acrelement + ' - ' + element.name;
	      data.results.push(school);
	    });
	    
	  });
	  
          query.callback(data);
      }
  });

  /*$('#teacher').select2({
      query: function (query) {
          var data = {results: []}, i, j, s;
          var regex = new RegExp(query.term, 'i');
          var university_query = { 'university' : new Meteor.Collection.ObjectID(amplify.store('university')) };
          var name_query = {$or : [ {'first_name' : regex}, {'last_name' : regex} ]};
          data.results = Professors.find({$and : [name_query, university_query]}).fetch();
          data.results.forEach(function(element, index, array) {
            element.id = element._id._str;
            element.text = element.first_name + ' - ' + element.last_name;
          });
          query.callback(data);
      }
  });*/

  $('#ac_professor').select2({
      query: function (query) {
          var data = {results: []}, i, j, s;
          var regex = new RegExp(query.term, 'i');
          var university_query = { 'university' : new Meteor.Collection.ObjectID(amplify.store('university')) };
          var name_query = {$or : [ {'first_name' : regex}, {'last_name' : regex} ]};
          data.results = Professors.find({$and : [name_query, university_query]}).fetch();
          data.results.forEach(function(element, index, array) {
            element.id = element._id._str;
            element.text = element.first_name + ' - ' + element.last_name;
          });
          query.callback(data);
      }
  });

  $('#class').select2({
      query: function (query) {
          var data = {results: []}, i, j, s;
          var regex = new RegExp(query.term, 'i');
          var university_query = { 'university' : new Meteor.Collection.ObjectID(amplify.store('university')) };
          var name_query = {'name' : regex};
          data.results = Classes.find({$and : [name_query, university_query]}).fetch();
          data.results.forEach(function(element, index, array) {
            element.id = element._id;
            element.text = element.name;
          });
          query.callback(data);
      }
  });

  $('.select2-drop').each( function( index, element ) {
    if (index == 1) {
      $(element).append('<div class="add" onclick="setTimeout(\'addClass();\');"><span class="glyphicon glyphicon-plus"></span> Add new class</div>');
    }
    /*if (index == 2) {
      $(element).append('<div class="add"><span class="glyphicon glyphicon-plus"></span> Add new professor</div>');
    }*/
    console.log(element);
  });

  $('#university').change(function() {
    $('#teacher').select2("enable", true);
    $('#class').select2("enable", true);
    $('#class').select2("val", '');
    $('#teacher').select2("val", '');
    amplify.store('university', $(this).val() );
    amplify.store('university-name', $('#university').select2("data").text);
  });
};

addProfessor = function() {
  setTimeout("$('#teacher').select2('close');", 100);
  $('#addProfessor').dialog('open'); 
}

addClass = function() {
  $('#class').select2('close');
  $('#addClass').dialog('open');
}

noteUpdated = function(destinationNoteID) {
  var noteID = destinationNoteID || getParameterByName("id");
  var note = Documents.findOne({_id : noteID});
  if (note)
  {
    Session.set("noteID", noteID);
    Session.set("title", note.title);
    Session.set("class", note.class);
    Session.set("university", note.university);
  }
  else
    window.location.replace("/noteNotFound");
}

createNote = function() {
  return Documents.insert({
    title: "untitled",
    university: Session.get("university"),
    class: Session.get("class")
  }, function(err, id) {
    if (!id) {
      return;
    }
    noteUpdated(id);
    window.history.pushState("/note?id=" + id, "Title", "/note?id=" + id);
    return Session.set("noteID", id);
  });
}

Template.note.created = noteUpdated;

Template.noteEditor.noteID = function() {
  return Session.get("noteID");
};

Template.noteTitle.title = function() {
  return Session.get("title");
};

getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//********************************************
//Imported from CoffeeScript
//********************************************

Handlebars.registerHelper("withif", function(obj, options) {
  if (obj) {
    return options.fn(obj);
  } else {
    return options.inverse(this);
  }
});

Template.notesList.documents = function() {
  return Documents.find();
};

Template.notesList.events = {
  "click button": createNote
};

Template.noteListItem.current = function() {
  return Session.equals("noteID", this._id);
};

Template.noteEditor.events = {
  "keydown input": function(e) {
    var id;
    if (e.keyCode !== 13) {
      return;
    }
    e.preventDefault();
    $(e.target).blur();
    id = Session.get("noteID");
    var title = e.target.value;
    Session.set("title", title);
    return Documents.update(id, {
      title: title,
      class: Session.get("class"),
      university: Session.get("university")
    });
  },
  "click button": function(e) {
    var id;
    e.preventDefault();
    id = Session.get("noteID");
    Session.set("noteID", null);
    return Meteor.call("deleteDocument", id);
  }
};

Template.noteEditor.config = function() {
  return function(ace) {
    ace.setShowPrintMargin(false);
    return ace.getSession().setUseWrapMode(true);
  };
};
