# Use Case Diagram

## Use Case Explanation
The Use Case Diagram illustrates the functional requirements of the system by showing the interactions between different actors and the system's core functionalities.

### Actors
- **Customer:** The primary user seeking to rent or buy properties.
- **Owner/Agent:** The user providing the listings.
- **Admin:** The system orchestrator responsible for verification and moderation.

### Core Functions
- **Listing Management:** Creating and maintaining property data.
- **Search & Discovery:** Finding relevant listings.
- **Booking Workflow:** Process from request to acceptance/rejection.
- **Moderation:** Ensuring platform safety.


![Use Case Diagram](images/useCaseDiagram.jpg)

## PlantUML Source
```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Customer" as C
actor "Owner/Agent" as O
actor "Admin" as A

rectangle "Real Estate Management System" {
    usecase "Register/Login" as UC1
    usecase "Search properties" as UC2
    usecase "View property details" as UC3
    usecase "Request Booking" as UC4
    usecase "Schedule Visit" as UC5
    usecase "Track Booking Status" as UC6
    
    usecase "Add/Update/Delete Listings" as UC7
    usecase "View Booking Requests" as UC8
    usecase "Accept/Reject Booking" as UC9
    
    usecase "Verify Property Listings" as UC10
    usecase "Manage Users" as UC11
    usecase "Remove Fraudulent Listings" as UC12
}

C --> UC1
C --> UC2
C --> UC3
C --> UC4
C --> UC5
C --> UC6

O --> UC1
O --> UC7
O --> UC8
O --> UC9

A --> UC10
A --> UC11
A --> UC12

UC10 ..> UC7 : <<include>>
UC9 ..> UC8 : <<include>>
@enduml
```
