### Car Booking Management System Documentation

This TypeScript code implements a simple car booking management system using the Azle library for data storage and manipulation. The system allows users to perform various operations such as adding, updating, deleting, and retrieving car bookings. It also provides functionalities for searching, counting, and pagination of car bookings.

#### 1. Types

##### `CarBooking`
- Represents the structure of a car booking record.
- Fields:
  - `id`: Unique identifier for the car booking.
  - `carModel`: Model of the car being booked.
  - `startDate`: Start date of the booking.
  - `endDate`: End date of the booking.
  - `location`: Location where the car will be booked.
  - `userId`: ID of the user making the booking.
  - `price`: Price of the booking.
  - `isPaid`: Indicates whether the booking has been paid.
  - `createdAt`: Timestamp indicating when the booking was created.
  - `updatedAt`: Optional timestamp indicating when the booking was last updated.

##### `CarBookingPayload`
- Represents the structure of the payload used in creating or updating a car booking.
- Fields:
  - Same as `CarBooking`, excluding `id`, `createdAt`, and `updatedAt`.

#### 2. Functions

##### `getCarBookings()`
- Retrieves all car bookings stored in the system.
- Returns a `Result<Vec<CarBooking>, string>`.

##### `getCarBooking(id: string)`
- Retrieves a specific car booking by its ID.
- Parameters:
  - `id`: ID of the car booking to retrieve.
- Returns a `Result<CarBooking, string>`.

##### `addCarBooking(payload: CarBookingPayload)`
- Adds a new car booking to the system.
- Parameters:
  - `payload`: Payload containing car booking details.
- Returns a `Result<CarBooking, string>`.

##### `updateCarBooking(id: string, payload: CarBookingPayload)`
- Updates an existing car booking by its ID.
- Parameters:
  - `id`: ID of the car booking to update.
  - `payload`: Payload containing updated car booking details.
- Returns a `Result<CarBooking, string>`.

##### `deleteCarBooking(id: string)`
- Deletes a car booking by its ID.
- Parameters:
  - `id`: ID of the car booking to delete.
- Returns a `Result<CarBooking, string>`.

##### `searchCarBookings(keyword: string)`
- Searches for car bookings based on a keyword in car models.
- Parameters:
  - `keyword`: Keyword to search for in car models.
- Returns a `Result<Vec<CarBooking>, string>`.

##### `countCarBookings()`
- Counts the total number of car bookings in the system.
- Returns a `Result<number, string>`.

##### `getCarBookingsPaginated(page: number, pageSize: number)`
- Retrieves a paginated list of car bookings.
- Parameters:
  - `page`: Page number.
  - `pageSize`: Number of items per page.
- Returns a `Result<Vec<CarBooking>, string>`.

##### `getCarBookingsByTimeRange(startTime: nat64, endTime: nat64)`
- Retrieves car bookings within a specific time range.
- Parameters:
  - `startTime`: Start time of the range.
  - `endTime`: End time of the range.
- Returns a `Result<Vec<CarBooking>, string>`.

##### `getCarBookingsByStartDate(startDate: nat64)`
- Retrieves car bookings by start date.
- Parameters:
  - `startDate`: Start date to filter bookings.
- Returns a `Result<Vec<CarBooking>, string>`.

##### `getCarBookingsByEndDate(endDate: nat64)`
- Retrieves car bookings by end date.
- Parameters:
  - `endDate`: End date to filter bookings.
- Returns a `Result<Vec<CarBooking>, string>`.

##### `getCarBookingsByCarModel(carModel: string)`
- Retrieves car bookings by car model.
- Parameters:
  - `carModel`: Car model to filter bookings.
- Returns a `Result<Vec<CarBooking>, string>`.

#### 3. Usage

- Import the necessary functions and types from the module.
- Use the provided functions to perform CRUD operations on car bookings.
- Handle the returned `Result` types appropriately to manage success or failure cases.

#### 4. Dependencies

- `azle`: Provides data storage and manipulation functionalities.
- `uuid`: Generates UUIDs for car booking IDs.

#### 5. Notes

- The `globalThis.crypto` workaround is used to make the `uuid` package compatible with Azle.
