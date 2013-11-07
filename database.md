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
	* Name
	* Description
	* UniversityID (Unless we want to allow teachers to teach at multiple universities, Should not have to keep database normalized)
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