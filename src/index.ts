import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt } from 'azle';
import { v4 as uuidv4 } from 'uuid';

// Define the type for a car booking
type CarBooking = Record<{
    id: string;
    carModel: string;
    startDate: nat64;
    endDate: nat64;
    location: string;
    userId: string;
    price: number;
    isPaid: boolean;
    createdAt: nat64;
    updatedAt: Opt<nat64>;
}>

// Define the type for the payload used in creating or updating a car booking
type CarBookingPayload = Record<{
    carModel: string;
    startDate: nat64;
    endDate: nat64;
    location: string;
    userId: string;
    price: number;
    isPaid: boolean;
}>

// Create storage for car bookings
const carBookingStorage = new StableBTreeMap<string, CarBooking>(0, 44, 1024);

/**
 * Get all car bookings.
 * @returns Result<Vec<CarBooking>, string> - A Result containing a Vec of car bookings or an error message.
 */
$query;
export function getCarBookings(): Result<Vec<CarBooking>, string> {
    try {
        return Result.Ok(carBookingStorage.values());
    } catch (error: unknown) {
        return Result.Err<Vec<CarBooking>, string>(`Error getting car bookings: ${(error as Error).message}`);
    }
}

/**
 * Get a specific car booking by ID.
 * @param id - The ID of the car booking to retrieve.
 * @returns Result<CarBooking, string> - A Result containing the requested car booking or an error message.
 */
$query;
export function getCarBooking(id: string): Result<CarBooking, string> {
    try {
        return match(carBookingStorage.get(id), {
            Some: (carBooking) => Result.Ok<CarBooking, string>(carBooking),
            None: () => Result.Err<CarBooking, string>(`A car booking with id=${id} not found`)
        });
    } catch (error: unknown) {
        return Result.Err<CarBooking, string>(`Error getting car booking: ${(error as Error).message}`);
    }
}

/**
 * Add a new car booking.
 * @param payload - The payload containing car booking details.
 * @returns Result<CarBooking, string> - A Result containing the newly added car booking or an error message.
 */
$update;
export function addCarBooking(payload: CarBookingPayload): Result<CarBooking, string> {
    try {
        // Validate input
        if (!payload.carModel || !payload.startDate || !payload.endDate || !payload.location || !payload.userId || payload.price === undefined || payload.isPaid === undefined) {
            return Result.Err<CarBooking, string>('Invalid input. Please provide all required fields.');
        }

        // Validate date range
        if (payload.startDate >= payload.endDate) {
            return Result.Err<CarBooking, string>('End date must be after the start date.');
        }

        // Create and insert the car booking
        const carBooking: CarBooking = {
            id: uuidv4(),
            createdAt: ic.time(),
            updatedAt: Opt.None,
            ...payload
        };
        carBookingStorage.insert(carBooking.id, carBooking);

        return Result.Ok(carBooking);
    } catch (error: unknown) {
        return Result.Err<CarBooking, string>(`Error adding car booking: ${(error as Error).message}`);
    }
}

/**
 * Update an existing car booking by ID.
 * @param id - The ID of the car booking to update.
 * @param payload - The payload containing updated car booking details.
 * @returns Result<CarBooking, string> - A Result containing the updated car booking or an error message.
 */
$update;
export function updateCarBooking(id: string, payload: CarBookingPayload): Result<CarBooking, string> {
    try {
        // Validate input
        if (!payload.carModel || !payload.startDate || !payload.endDate || !payload.location || !payload.userId || payload.price === undefined || payload.isPaid === undefined) {
            return Result.Err<CarBooking, string>('Invalid input. Please provide all required fields.');
        }

        // Validate date range
        if (payload.startDate >= payload.endDate) {
            return Result.Err<CarBooking, string>('End date must be after the start date.');
        }

        // Update the car booking
        return match(carBookingStorage.get(id), {
            Some: (carBooking) => {
                const updatedCarBooking: CarBooking = {
                    ...carBooking,
                    ...payload,
                    updatedAt: Opt.Some(ic.time())
                };
                carBookingStorage.insert(carBooking.id, updatedCarBooking);
                return Result.Ok<CarBooking, string>(updatedCarBooking);
            },
            None: () => Result.Err<CarBooking, string>(`Couldn't update a car booking with id=${id}. Car booking not found`)
        });
    } catch (error: unknown) {
        return Result.Err<CarBooking, string>(`Error updating car booking: ${(error as Error).message}`);
    }
}

/**
 * Delete a car booking by ID.
 * @param id - The ID of the car booking to delete.
 * @returns Result<CarBooking, string> - A Result containing the deleted car booking or an error message.
 */
$update;
export function deleteCarBooking(id: string): Result<CarBooking, string> {
    try {
        return match(carBookingStorage.remove(id), {
            Some: (deletedCarBooking) => Result.Ok<CarBooking, string>(deletedCarBooking),
            None: () => Result.Err<CarBooking, string>(`Couldn't delete a car booking with id=${id}. Car booking not found.`)
        });
    } catch (error: unknown) {
        return Result.Err<CarBooking, string>(`Error deleting car booking: ${(error as Error).message}`);
    }
}

/**
 * Search for car bookings based on a keyword.
 * @param keyword - The keyword to search for in car models.
 * @returns Result<Vec<CarBooking>, string> - A Result containing a Vec of filtered car bookings or an error message.
 */
$query;
export function searchCarBookings(keyword: string): Result<Vec<CarBooking>, string> {
    try {
        const filteredBookings = carBookingStorage
            .values()
            .filter((booking) =>
                booking.carModel.toLowerCase().includes(keyword.toLowerCase())
            );

        return Result.Ok(filteredBookings);
    } catch (error: unknown) {
        return Result.Err<Vec<CarBooking>, string>(`Error searching car bookings: ${(error as Error).message}`);
    }
}

/**
 * Count the total number of car bookings.
 * @returns Result<number, string> - A Result containing the count of car bookings or an error message.
 */
$query;
export function countCarBookings(): Result<number, string> {
    try {
        const count = carBookingStorage.len();

        // Convert the bigint to number
        const countAsNumber = Number(count);

        return Result.Ok(countAsNumber);
    } catch (error: unknown) {
        return Result.Err<number, string>(`Error counting car bookings: ${(error as Error).message}`);
    }
}

/**
 * Get a paginated list of car bookings.
 * @param page - The page number.
 * @param pageSize - The number of items per page.
 * @returns Result<Vec<CarBooking>, string> - A Result containing a Vec of paginated car bookings or an error message.
 */
$query;
export function getCarBookingsPaginated(page: number, pageSize: number): Result<Vec<CarBooking>, string> {
    try {
        const startIdx = (page - 1) * pageSize;
        const paginatedBookings = carBookingStorage.values().slice(startIdx, startIdx + pageSize);

        return Result.Ok(paginatedBookings);
    } catch (error: unknown) {
        return Result.Err<Vec<CarBooking>, string>(`Error getting paginated car bookings: ${(error as Error).message}`);
    }
}

/**
 * Get car bookings within a specific time range.
 * @param startTime - The start time of the range.
 * @param endTime - The end time of the range.
 * @returns Result<Vec<CarBooking>, string> - A Result containing a Vec of filtered car bookings or an error message.
 */
$query;
export function getCarBookingsByTimeRange(startTime: nat64, endTime: nat64): Result<Vec<CarBooking>, string> {
    try {
        const filteredBookings = carBookingStorage
            .values()
            .filter((booking) => booking.startDate >= startTime && booking.endDate <= endTime);

        return Result.Ok(filteredBookings);
    } catch (error: unknown) {
        return Result.Err<Vec<CarBooking>, string>(`Error getting car bookings by time range: ${(error as Error).message}`);
    }
}

/**
 * Get car bookings by start date.
 * @param startDate - The start date to filter bookings.
 * @returns Result<Vec<CarBooking>, string> - A Result containing a Vec of filtered car bookings or an error message.
 */
$query;
export function getCarBookingsByStartDate(startDate: nat64): Result<Vec<CarBooking>, string> {
    try {
        const filteredBookings = carBookingStorage
            .values()
            .filter((booking) => booking.startDate === startDate);

        return Result.Ok(filteredBookings);
    } catch (error: unknown) {
        return Result.Err<Vec<CarBooking>, string>(`Error getting car bookings by start date: ${(error as Error).message}`);
    }
}

/**
 * Get car bookings by end date.
 * @param endDate - The end date to filter bookings.
 * @returns Result<Vec<CarBooking>, string> - A Result containing a Vec of filtered car bookings or an error message.
 */
$query;
export function getCarBookingsByEndDate(endDate: nat64): Result<Vec<CarBooking>, string> {
    try {
        const filteredBookings = carBookingStorage
            .values()
            .filter((booking) => booking.endDate === endDate);

        return Result.Ok(filteredBookings);
    } catch (error: unknown) {
        return Result.Err<Vec<CarBooking>, string>(`Error getting car bookings by end date: ${(error as Error).message}`);
    }
}

/**
 * Get car bookings by car model.
 * @param carModel - The car model to filter bookings.
 * @returns Result<Vec<CarBooking>, string> - A Result containing a Vec of filtered car bookings or an error message.
 */
$query;
export function getCarBookingsByCarModel(carModel: string): Result<Vec<CarBooking>, string> {
    try {
        const filteredBookings = carBookingStorage
            .values()
            .filter((booking) => booking.carModel.toLowerCase() === carModel.toLowerCase());

        return Result.Ok(filteredBookings);
    } catch (error: unknown) {
        return Result.Err<Vec<CarBooking>, string>(`Error getting car bookings by car model: ${(error as Error).message}`);
    }
}

// Workaround to make uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};

