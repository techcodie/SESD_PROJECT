# Sequence Diagram

## Main Flow: Booking Request
This diagram demonstrates the interaction between a Customer, the System, and the Owner during a typical booking request lifecycle.

### Steps:
1. Customer initiates a booking request for a specific property.
2. The System validates availability and persists the request.
3. The Owner is notified of the new request.
4. The Owner reviews the request and performs an action (Accept/Reject).
5. The System updates the status and notifies the Customer of the decision.

## PlantUML Source
```plantuml
@startuml
actor Customer as C
participant "System UI" as UI
participant "Booking Manager" as BM
database "Property DB" as DB
actor "Owner/Agent" as O

C -> UI : Search and Select Property
activate UI
UI -> DB : Get Property Details
DB --> UI : Details Found
UI -> C : Display Property Details
deactivate UI

C -> UI : Request Booking
activate UI
UI -> BM : createBookingRequest(customerId, propertyId)
activate BM

BM -> DB : checkAvailability(propertyId)
activate DB
DB --> BM : available
deactivate DB

BM -> DB : saveBooking(PENDING)
activate DB
DB --> BM : saved
deactivate DB

BM --> UI : Request Submitted Successfully
UI --> C : Show "Pending Approval" Status
deactivate UI

BM -> O : Notify: New Booking Request
activate O
O -> UI : View Booking Request Details
UI -> BM : fetchRequest(bookingId)
BM --> UI : Request Data
UI --> O : Display Request

O -> UI : Accept/Reject Booking
UI -> BM : updateBookingStatus(status)
BM -> DB : updateStatus(status)
deactivate O

BM -> C : Notify: Booking Updated (Accepted/Rejected)
deactivate BM
@enduml
```
