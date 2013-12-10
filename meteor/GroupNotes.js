var Universities = new Meteor.Collection("universities");
var Professors = new Meteor.Collection("professors");

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

  Template.noteFinder.universities = function (today) {
    return Universities.find();
  };

  Template.noteFinder.rendered = function() {
    $('#university').select2({
        dropDownCssClass: 'noteFinderDrop',
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
    $('#university').change(function() {
      $('#teacher').removeAttr('disabled');
      $('#teacher').select2("enable", true);
      $('#class').select2("enable", true);
    });
    $('#teacher').select2({
        query: function (query) {
            var data = {results: []}, i, j, s;
            var regex = new RegExp(query.term, 'i');
            console.log($('#university').val());
            var university_query = { 'university' : new Meteor.Collection.ObjectID($('#university').val()) };
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
            query.callback(data);
        }
    });
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
