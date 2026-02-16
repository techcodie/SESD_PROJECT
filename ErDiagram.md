# Entity Relationship (ER) Diagram

## Database Tables and Relations
The relational schema is designed to support high data integrity and efficient querying for property searches and booking management.

### Key Entities:
- **Users:** Stores credentials and profile data for all actors.
- **Properties:** Central table for listing details.
- **Bookings:** Join table representing the interaction between users and properties.
- **Addresses:** Stores geographic information to avoid redundancy.

## PlantUML Source
```plantuml
@startuml
entity "Users" as users {
    * user_id : UUID <<PK>>
    --
    * name : VARCHAR(100)
    * email : VARCHAR(100) <<UNIQUE>>
    * password_hash : VARCHAR(255)
    * role : ENUM('CUSTOMER', 'OWNER', 'ADMIN')
    created_at : TIMESTAMP
}

entity "Properties" as properties {
    * property_id : UUID <<PK>>
    --
    * owner_id : UUID <<FK>>
    * title : VARCHAR(200)
    description : TEXT
    * price : DECIMAL(15,2)
    * property_type : ENUM('APARTMENT', 'HOUSE', 'CONDO')
    * status : ENUM('AVAILABLE', 'SOLD', 'UNVERIFIED')
    address_id : UUID <<FK>>
}

entity "Bookings" as bookings {
    * booking_id : UUID <<PK>>
    --
    * customer_id : UUID <<FK>>
    * property_id : UUID <<FK>>
    * booking_date : DATE
    * status : ENUM('PENDING', 'ACCEPTED', 'REJECTED')
    comments : TEXT
}

entity "Addresses" as addresses {
    * address_id : UUID <<PK>>
    --
    * street : VARCHAR(255)
    * city : VARCHAR(100)
    * state : VARCHAR(100)
    * zip_code : VARCHAR(20)
}

users ||--o{ properties : "owns"
users ||--o{ bookings : "makes"
properties ||--o{ bookings : "receives"
properties ||--|| addresses : "located at"
@enduml
```

![ER Diagram](images/ErDiagram.jpg)
