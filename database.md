DB Design
=========
* Users
	* UserID
	* UserName
	* PasswordHash
	* FirstName
	* LastName
	* Email (pull profile picture from gravatar)

* Note
	* NoteID
	* ClassID
	* AuthorID
	* TeacherID
	* UniverityID
	* FileServerLocation

* Classes
	* ClassID
	* Name
	* Description
	* UniversityID
	* TeacherID

* Teachers
	* TeacherID
	* Name
	* UniversityID

* Univerisities
	* UniversityID
	* Name
	* City
	* State
	* ZipCode

* SubscribedClasses
	* UserID
	* ClassID