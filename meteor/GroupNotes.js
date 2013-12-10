//var Universities = Meteor.Collections("universities");

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
        minimumInputLength: 1,
        query: function (query) {
            var data = {results: []}, i, j, s;
            data.results.push({id: 'byu', text: "Brigham Young University"})
            data.results.push({id: 'uvu', text: "Utah Valley University"})
            data.results.push({id: 'u of u', text: "University of Utah"})
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
