var Universities = new Meteor.Collection("universities");
var Professors = new Meteor.Collection("professors");
var Classes = new Meteor.Collection("classes");
var Chats = new Meteor.Collection("chats");

var fruits = ['Watermelon','Banana','Mulberry','Plum','Nut','Currant','Boysenberry','Breadfruit','Star fruit','Redcurrant',
'Persimmon','Jambul','Date','Olive','Blackberry','Damson','Strawberry','Coconut','Ugli fruit','Elderberry','Fig','Lime',
'Mango','Durian','Kumquat','Quince','Lychee','Blood Orange','Blueberry','Apricot','Rock melon','Dragonfruit','Huckleberry',
'Clementine','Cherimoya','Cranberry','Feijoa','Physalis','Rambutan','Cantaloupe','Bilberry','Pear','Lemon','Honeydew','Prune',
'Gooseberry','Cloudberry','Satsuma','Jackfruit','Blackcurrant','Salal berry','Honeydew','Mandarine','Orange','Pomelo','Papaya',
'Eggplant','Grapefruit','Peach','Grape','Jujube','Kiwi fruit','Goji berry','Pepper','Cantaloupe','Loquat','Tamarillo','Pomegranate',
'Raspberry','Guava','Avocado','Cucumber','Passionfruit','Tangerine','Melon','Pineapple','Cherry','Nectarine','Apple','Watermelon'];

var fruitID = 0;

var Documents = new Meteor.Collection("documents");

Meteor.methods({
  getPseudoName: function () {
    fruitID = (fruitID + 1) % 78;
    console.log(fruitID);
    return fruits[fruitID - 1];
  },
  postChat: function(name, text, classID, noteID) {
    Chats.insert({
      username: name,
      message: text,
      insert: new Date().getTime(),
      classID: classID,
      noteID: noteID
    });
  },
  deleteDocument: function(id) {
    Documents.remove(id);
    if (!this.isSimulation) {
      return ShareJS.model["delete"](id);
    }
  }
});
