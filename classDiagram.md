# Class Diagram

## Major OOP Classes
The system follows a modular object-oriented design to ensure scalability and ease of maintenance. The diagram highlights core entities and their relationships.

### Key Classes:
- **User (Base):** Abstract class containing common attributes for all users.
- **Customer, Owner, Admin:** Specific implementations with role-based behaviors.
- **Property:** Represents a real estate asset with attributes like price, location, and status.
- **Booking:** Represents the transactional relationship between a Customer and a Property.
- **Address:** Compositional element for Property and User locations.


![Class Diagram](images/classDiagram.jpg)

## PlantUML Source
```plantuml
@startuml
abstract class User {
    + String userId
    + String name
    + String email
    + String password
    + login()
    + logout()
}

class Customer {
    + List<Booking> searchHistory
    + requestBooking(propertyId)
    + viewStatus()
}

class Owner {
    + List<Property> listedProperties
    + addProperty(Property)
    + manageBooking(bookingId, status)
}

class Admin {
    + verifyProperty(propertyId)
    + manageUser(userId)
}

class Property {
    + String propertyId
    + String title
    + String description
    + Double price
    + PropertyStatus status
    + Address location
    + updateListing()
}

class Booking {
    + String bookingId
    + Date requestDate
    + BookingStatus status
    + updateStatus()
}

class Address {
    + String street
    + String city
    + String state
    + String zipCode
}

User <|-- Customer
User <|-- Owner
User <|-- Admin

Customer "1" -- "*" Booking : requests
Owner "1" -- "*" Property : owns
Property "1" -- "*" Booking : receives
Property "1" *-- "1" Address : located at

enum PropertyStatus {
    AVAILABLE
    RENTED
    SOLD
    PENDING_VERIFICATION
}

enum BookingStatus {
    PENDING
    ACCEPTED
    REJECTED
    COMPLETED
}
@enduml
```

