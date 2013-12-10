file = open('universitieslist.txt','r')
output = open('universitiesjson.txt','w')


for r in file:
   s = r.split('-')
   acronym = s[0].strip()
   name = s[1].strip()
   
   output.write("{\"acronym\": \"" + acronym + "\",\"name\": \"" + name + "\"}\n")
   

file.close();
output.close();
