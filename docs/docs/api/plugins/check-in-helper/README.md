# Check-in Helper Plugin

The check-in-helper plugin is designed to assist with the check-in process on the cpdaily app. It provides a set of functions and utilities to simplify the check-in workflow.

## Installation

To install the check-in-helper plugin, you can use npm or yarn:

```bash
npm install @ceajs/check-in-helper
```

or

```bash
yarn add @ceajs/check-in-helper
```

## Usage

To use the check-in-helper plugin, you need to import it into your project:

```javascript
import { CheckIn } from '@ceajs/check-in-helper';
```

### Example

Here is an example of how to perform a check-in using the check-in-helper plugin:

```javascript
import { CheckIn } from '@ceajs/check-in-helper';

const checkIn = new CheckIn();

// Set the necessary parameters for check-in
checkIn.setParams({
  username: 'your_username',
  password: 'your_password',
  location: 'your_location',
});

// Perform the check-in
const result = await checkIn.checkIn();

console.log(result);
```

## Additional Information

- Make sure to provide valid credentials and location for the check-in process.
- The check-in-helper plugin handles the necessary authentication and form submission for the check-in process.