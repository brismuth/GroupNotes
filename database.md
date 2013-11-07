DB Design
=========
* Users
	* UserID
	* UserName
	* PasswordHash
	* FirstName
	* LastName
	* Email (pull profile picture from gravatar)

* Notes
	* NoteID
	* ClassID
	* AuthorID
	* FileServerLocation

* Classes
	* ClassID 
	* TeacherID
	* UniversityID
	* Name
	* Description

* Teachers
	* TeacherID
	* Name

* Univerisities
	* UniversityID
	* Name
	* City
	* State
	* ZipCode

* SubscribedClasses
	* UserID
	* ClassID