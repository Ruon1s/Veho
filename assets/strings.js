import React from 'react';

const strings = {
    queueLayout: {
        buttons: {
            startCharging: 'Start Charging',
            skip: 'Skip',
            queue: 'Queue',
            leaveQueue: 'Leave Queue',
            toChargingView: 'To Charging View'
        },
    },
    managerLayout: {
        alert: {
            addCarMessage: (car) => { return `Mark ${car.name} to queue?` },
            removeCarMessage: (car) => { return `Remove ${car.name} from queue?` },
            title: 'Prioritize'
        }
    },
    queueInfo: {
        numberOfCars: 'Number of cars in queue:',
        noCarsInQueue: 'The queue is empty',
        freeSpots: 'Free spots:',
        noSpots: 'No spots are open',
        yourPosition: 'Your position in queue:',
        notInQueue: 'You are not in queue'
    },
    chargingView: {
        buttons: {
            stopCharging: 'Stop Charging'
        },
    },
    settings: {
        buttons: {
            addNewCar: 'Add new car',
            adminPanel: 'Admin panel',
            logout: 'Logout'
        }
    },
    loginAndRegister: {
        carForm: {
            licensePlate: 'License plate number',
            carName: 'Car name',

        },
        labels: {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            password: 'Password',
            repeatPassword: 'Retype Password',
            login: 'Login',
            register: 'Register',
        },
        buttons: {
            forgotPassword: 'Forgot password',
            backToLogin: 'Back to Login',
            login: 'Login',
            register: 'Register',
        }
    },
    adminPanel: {
        forms: {
            addOrEditManager: {
                addManager: 'Add a manager',
                foundUser: 'Found user!',
                buttons: {
                    addAsManager: 'Add as a manager',
                }
            },
            addOrEditLocation: {
                editLocation: 'Edit Location',
                addLocation: 'Add a new Location',
                inputHints: {       // If there's no current info, conditional version is used
                    currentName: 'Name, current:',
                    currentNameConditional: 'Location name...',
                    publicStations: 'Public stations, current:',
                    publicStationsConditional: 'Number of public charging stations...',
                    dedicatedStations: 'Dedicated stations, current:',
                    dedicatedStationsConditional: 'Number of dedicated charging stations...'
                }
            }
        },
    },
    general: {
        buttons: {
            back: 'back',
            reset: 'reset',
            delete: 'delete',
            remove: 'remove',
            edit: 'edit',
            close: 'close',
            cancel: 'cancel',
            ok: 'ok',
            save: 'save'
        },
        form: {
            email: 'Email:',
            fullName: 'Full name:',
            buttons: {
                clear: 'Clear'
            }
        }
    }
}

export default strings