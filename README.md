# INFO-6132 - Final Project - GT Garage Tracker App
- Aggrey Nhiwatiwa
- Samet Berk Ozdemir

## Project Details
### Description
This app is made as a companion app for players of a racing game who want to manage their collection of cars in their garage, serving both as a game wiki and collection visualisation tool. The user is able to also get insights about their garage collection

### Data
Firebase Firestore and Firebase Auth are used in this project to allow users to sign up, login and and send password requests for this app.
The car data was obtained from: https://gtdb.io/gt7/used-cars

## Screens and Features
### LoginScreen
* Allows a user to create an account, login and make password reset requests.
* Regex for input validation

### CarsScreen
* The global list of cars from the cloud db
* Shows basic information of each Car
* When a car object is pressed here, the user is taken to the detailsScreen for that car
* Implements a filter which enables users to organise their list of cars by attributes such as
their credit cost, PP value or whether the car is in limited supply.

### CarDetailsScreen
* Shows the user more details of the car they pressed.
* Enables the user to add this car to their garage if it is not already present.

### GarageScreen
* Shows the user a list of their own cars.
* The user can remove a car from their garage here.
* The user can also use the same filters from the CarsScreen on the cars in their garage

### SettingsScreen
* Styling used this source as a base for the form: https://withfra.me/components/settings 
* Displays an animated user profile picture with their personal details
* i18next localisation implemented for both English(EN) and Turkish(TR), note that this does not apply to the car description fetched from the live data source
* Uses the React Native Linking API to allow the user to email developers for support or to report a bug, with a prepopulated email template.

## Animations
* Lottie animated splash screen implemented.
* Custom garage door sliding animation created using the React Animated Library

