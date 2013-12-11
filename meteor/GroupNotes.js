var Universities = new Meteor.Collection("universities");
var Professors = new Meteor.Collection("professors");
var Classes = new Meteor.Collection("classes");

if (Meteor.isClient) {
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
  });

  Template.addClass.rendered = function() {
    $( "#addClass" ).dialog({
      draggable: false,
      resizable: false,
      autoOpen: false,
      height: 260,
      width: 350,
      modal: true,
      buttons: {
        "Create": function() {
            console.log(this);
            Classes.insert( {
              'professor' : $('#ac_professor').val(),
              'name' : $('#ac_name').val(),
              'description' : $('#ac_description').val(),
              'university' : new Meteor.Collection.ObjectID(amplify.store('university'))
            });
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
            data.results = Universities.find({$or : [{'name' : regex}, {'acronym' : regex}] }).fetch();
            data.results.forEach(function(element, index, array) {
              element.id = element._id._str;
              element.text = element.acronym + ' - ' + element.name;
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
              element.id = element._id._str;
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
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
