export const transactions = [
    {
        id: 1,
        title: 'Transaction 1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        status: 'COMPLETED',
        ratings: 5,
        location: 'Cebu, Philippines',
        buildingOwner: 'John Doe',
        ownerNumber: '099-999-999',
        expenses: '1,000,000.00',
        images: [
            '/src/assets/images/project4.jpeg',
            '/src/assets/images/project4.1.jpeg',
            '/src/assets/images/project4.2.jpeg',
            '/src/assets/images/project4.3.jpeg',
            '/src/assets/images/project4.4.jpeg'
        ],
        workers: [
            {
                id: 1001,
                fullname: 'Drake Kow',
                nickname: 'nickname 0',
            },
            {
                id: 1002,
                fullname: 'Example name',
                nickname: 'nickname 1',
            }
        ],
        materials: [
            {
                id: 2001,
                title: 'material 1',
                cost: '11.00',
                quantity: 1
            }
        ],
        serviceTypes: [
            {
                id: 3001,
                title: 'Home Renovations',
            }
        ],
        feedbacks: [],
        csvReport: '', // file type
        dateStarted: '04/23/2015',
        isExtended: false,
        createdDate: '04/12/2015',
        dateCompleted: '05/2/2016',
    },
    {
        id: 2,
        title: 'Transaction 2',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        status: 'COMPLETED',
        ratings: 5,
        location: 'Cebu, Philippines',
        buildingOwner: 'John Doe',
        expenses: '1,000,000.00',
        images: [
            '/src/assets/images/project4.jpeg',
            '/src/assets/images/project4.2.jpeg',
            '/src/assets/images/project4.3.jpeg',
            '/src/assets/images/project4.4.jpeg'
        ],
        workers: [
            {
                id: 1001,
                fullname: 'Drake Kow',
                nickname: 'nickname 0',
            },
            {
                id: 1002,
                fullname: 'Example name',
                nickname: 'nickname 1',
            }
        ],
        materials: [
            {
                id: 2001,
                title: 'material 1',
                cost: '11.00',
                quantity: 1
            },
            {
                id: 2002,
                title: 'material 2',
                cost: '11.00',
                quantity: 3
            }
        ],
        serviceTypes: [
            {
                id: 3001,
                title: 'Home Renovations',
            },
            {
                id: 3002,
                title: 'Roofing',
            }
        ],
        feedbacks: [],
        csvReport: '',
        dateStarted: '04/23/2015',
        isExtended: false,
        createdDate: '04/12/2015',
        dateCompleted: '05/2/2016',
    },
    {
        id: 3,
        title: 'Transaction 3',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        status: 'FAILED',
        ratings: 0,
        location: 'Cebu, Philippines',
        buildingOwner: 'John Doe',
        expenses: '0',
        images: [
        ],
        workers: [
            {
                id: 1001,
                fullname: 'Drake Kow',
                nickname: 'nickname 0',
            },
            {
                id: 1002,
                fullname: 'Example name',
                nickname: 'nickname 1',
            }
        ],
        materials: [
            {
                id: 2001,
                title: 'material 1',
                cost: '11.00',
                quantity: 1
            },
            {
                id: 2002,
                title: 'material 2',
                cost: '11.00',
                quantity: 3
            }
        ],
        serviceTypes: [
            {
                id: 3001,
                title: 'Home Renovations',
            },
            {
                id: 3002,
                title: 'Roofing',
            }
        ],
        feedbacks: [],
        csvReport: '',
        dateStarted: '04/23/2015',
        isExtended: false,
        createdDate: '04/12/2015',
        dateCompleted: '05/2/2016',
    }
];