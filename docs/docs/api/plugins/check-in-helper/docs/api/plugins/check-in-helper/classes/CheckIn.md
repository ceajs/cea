# CheckIn Class

The CheckIn class provides methods and properties for performing the check-in process on the cpdaily app.

## Constructor

### `new CheckIn()`

Creates a new instance of the CheckIn class.

## Methods

### `setParams(params: CheckInParams): void`

Sets the parameters for the check-in process.

- `params` (object): An object containing the following properties:
  - `username` (string): The username for authentication.
  - `password` (string): The password for authentication.
  - `location` (string): The location for the check-in.

### `checkIn(): Promise<CheckInResult>`

Performs the check-in process.

Returns a promise that resolves to a CheckInResult object.

## Properties

### `params: CheckInParams`

The parameters for the check-in process.

## Example

```javascript
import { CheckIn } from '@ceajs/check-in-helper';

const checkIn = new CheckIn();

checkIn.setParams({
  username: 'your_username',
  password: 'your_password',
  location: 'your_location',
});

checkIn.checkIn()
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });
```