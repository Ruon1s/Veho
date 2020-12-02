const en = {
    // Navigation
    home: 'Home',
    settings: 'Settings',

    // Login and register forms' buttons
    back: 'back',
    reset: 'reset',
    delete: 'delete',
    remove: 'remove',
    edit: 'edit',
    close: 'close',
    cancel: 'cancel',
    ok: 'ok',
    save: 'save',
    fullName: 'Full name',

    // Settings
    addNewCar: 'Add new car',
    adminPanel: 'Admin panel',
    logout: 'Logout',

    // Login and register
    licensePlate: 'License plate number',
    carName: 'Car name',
    addCarDetailsTitle: 'Add car details',

    // Labels for inputs
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    password: 'Password',
    repeatPassword: 'Retype Password',
    login: 'Login',
    register: 'Register',

    // Buttons for login and register screens
    forgotPassword: 'Forgot password?',
    backToLogin: 'Back to Login',
    login: 'Login',
    register: 'Register',

    // RegisterHints
    nameError: '*Must be at least 3 characters',
    emailError: '*Not a valid email',
    passwordError: '*Not strong enough',

    // Admin 
    adminHeader: 'Admin panel',
    addManager: 'Add a manager',
    foundUser: 'Found user!',

    // placeholder
    emailPlaceholder: 'Enter email...',

    //buttons: 
    addAsManager: 'Add as a manager',
    clear: 'Clear',
    search: 'Search',

    hideManagers: 'Hide managers',
    showManagers: 'Show managers',

    hideLocations: 'Hide locations',
    showLocations: 'Show locations',

    editLocation: 'Edit Location',
    addLocation: 'Add a new Location',
    addNewLocation: 'Add new Location',

    searchLocationPlaceholder: 'Search by location name...',

    // InputHints for admin. User and Location management
    currentName: 'Name, current:',
    currentNameConditional: 'Location name...',
    publicStations: 'Public stations, current:',
    publicStationsConditional: 'Number of public charging stations...',
    dedicatedStations: 'Dedicated stations, current:',
    dedicatedStationsConditional: 'Number of dedicated charging stations...',

    // QueueLayout 
    startCharging: 'Start Charging',
    stopCharging: 'Stop Charging',
    skip: 'Skip',
    queue: 'Queue',
    leaveQueue: 'Leave Queue',
    toChargingView: 'To Charging View',

    //managerLayout, for the alert message
    addCarMessage: (car) => { return `Mark ${car.name} to queue?` },
    removeCarMessage: (car) => { return `Remove ${car.name} from queue?` },
    title: 'Prioritize',

    // QueueInfo-component
    numberOfCars: 'Number of cars in queue:',
    noCarsInQueue: 'The queue is empty',
    freeSpots: 'Free spots:',
    noSpots: 'No spots are open',
    yourPosition: 'Your position in queue:',
    notInQueue: 'You are not in queue',

    // Charging view
    estimatedTime: 'Estimated time:',
}

export default en;