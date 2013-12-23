Meteor.absoluteUrl.defaultOptions.rootUrl = "http://groupnotes.org/"

var Viewers = new Meteor.Collection("viewers");
var Universities = new Meteor.Collection("universities");
var Professors = new Meteor.Collection("professors");
var Classes = new Meteor.Collection("classes");
var Chats = new Meteor.Collection("chats");
var Documents = new Meteor.Collection("documents");
var Docs = new Meteor.Collection("docs");

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

Meteor.autorun(function () {
  id = '';
  name = '';
  if (Meteor.userId()) {
    id = Meteor.userId();
    if (Meteor.user().profile && Meteor.user().profile.name) {
      name = Meteor.user().profile.name
    } else {
      var email = Meteor.user().emails[0].address
      name = email.split("@")[0];
    }
  } else {
    if (amplify.store('userID')) {
      id = amplify.store('userID');
    } else {
      id = new Meteor.Collection.ObjectID()._str;
      amplify.store('userID', id);
    }

    if (amplify.store('name')) {
      name = amplify.store('name');
    }
    else {
      Meteor.call("getPseudoName", function(error, name2) {
        name = name2;
        console.log(name);
        Session.set('name', name);
        amplify.store('name', name);
      });
    }
  }

  Session.set('userID', id);
  Session.set('name', name);
});

var scrollChatToBottom = function() {
  var elem = document.getElementById('chat-messages');
  if (elem) {
    elem.scrollTop = elem.scrollHeight;
  }
}

Template.chat.chat = function () {
  var cursor = Chats.find({classID: Session.get('class')});
  cursor.observe({
    added : scrollChatToBottom
  });
  return cursor;
}

Template.chat.viewers = function () {
  return Viewers.find({noteID: Session.get('noteID')});
}

Template.chat.rendered = function () {
  scrollChatToBottom();
}

Template.chat.events({
  'keypress #chat-input' : function (evt) {
    if (evt.which === 13) {
      var text = $('#chat-input').val();
      setTimeout("$('#chat-input').val('');", 50);
      Meteor.call("postChat", Session.get('name'), text, Session.get('class'), Session.get('noteID'));
    }
  }
});

Template.search.events({
  
  'click #searchsubmit' : function (evt) {
     Session.set("searchitem", $("#search").val());
  }
});

Template.search.search = function () {
  
  var searchitem = new String(Session.get("searchitem"));
  var terms = searchitem.split(" ");
  var docsquery = [];
  
  terms.forEach(function(element, index, array)
  {
    docsquery.push({"snapshot" : element});
  });
  
  
  var docsSearch = Docs.find({$or : docsquery});
  
  if (!docsSearch)
    return "";
  
  
  return docsSearch;
  
}

Template.search.searchTitle = function () {
  
  var searchitem = new String(Session.get("searchitem"));
  var terms = searchitem.split(" ");
  var documentquery = [];
  
  terms.forEach(function(element, index, array)
  {
    documentquery.push({"title" : element});
 
  });
  
  //console.log(documentquery);
    
  var documentsSearch = Documents.find({$or : documentquery});
  
  if (!documentsSearch)
    return "";
  
  return documentsSearch;
}

Template.notFound.page = function()
{
  return escape(window.location.pathname);
}

Template.addClass.rendered = function() {
  var d = new Date();
  var t = d.getTime();
  
  $( "#addClass" ).dialog({
    autoOpen: false,
    draggable: false,
    resizable: false,
    buttons: {
      "Create": function() {
          Classes.insert( {
            'name' : $('#ac_name').val(),
            'description' : $('#ac_description').val(),
            'university' : new Meteor.Collection.ObjectID(amplify.store('university')),
            'creationDate' : t
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
      console.log('New note created ' + noteID);
      noteUpdated(noteID);
    } else {
      noteID = note._id;
      console.log('Existing note found ' + noteID)
      console.log(note);
    }

    Router.go('/note?id=' + noteID);
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


deleteNote = function() {
    var id;
    id = Session.get("noteID");
    Session.set("noteID", null);
    return Meteor.call("deleteDocument", id);
}

noteUpdated = function(destinationNoteID) {
  var noteID = destinationNoteID || getParameterByName("id");
  var note = Documents.findOne({_id : noteID});
  var count = Documents.find().count();
  if (note)
  {
    Session.set("noteID", noteID);
    Session.set("title", note.title);
    Session.set("class", note.class);
    Session.set("university", note.university);
    if (Meteor.userId()) {
      var result = Viewers.update({
        _id: Session.get('userID')
      },{
        $set : {
          classID: Session.get("class"),
          noteID: Session.get("noteID"),
          name: Session.get("name")
        }
      }, {upsert: true});
    }
  }
  else if (count > 0)
  {
    Router.go("/noteNotFound");
  }
}

createNote = function() {
  return Documents.insert({
    title: "untitled",
    university: Session.get("university"),
    class: Session.get("class")
  }, function(err, id) {
    if (err) {
      console.log(err);
    }
    if (!id) {
      return;
    }
    noteUpdated(id);
    window.history.pushState("/note?id=" + id, "Title", "/note?id=" + id);
    return Session.set("noteID", id);
  });
}

Template.note.rendered = noteUpdated;

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
  return Documents.find({"class" : Session.get("class")});
};

Template.notesList.events = {
  "click button": createNote
};

Template.notesList.classtitle = function()
{
  var a = Classes.findOne({"_id" : Session.get("class")}); 
  return (a) ? a["name"] : "";
}

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
