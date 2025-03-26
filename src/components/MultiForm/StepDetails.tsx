import { JobRoles, JobDuration, BoatTypes, BoatLocation } from '../../features/Cruz/MultiformQuestions';
import { getUserData } from '../../utils/Utils';

export const StepDetails = () => {

    const userData = getUserData("userData");
    let memberdp = "";
    try {
        if (userData !== null) {
            memberdp = userData.members_profile_picture;
        } else {
            console.error("User data not found in local storage");
        }
    } catch (error) {
        console.error("Error parsing user data:", error);
    }
    const { jobRoles, error, isLoading } = JobRoles();
    const { boatType } = BoatTypes();
    const { jobDuration } = JobDuration();
    const { boatLocation } = BoatLocation();

    const steps = [
        {
            title: ' JOB DETAILS',
            questions: [
                {
                    title: 'What’s the main job role?',
                    type: 'radio',
                    name: 'jobRoles',
                    options: {
                        "2": "2nd Engineer",
                        "3": "Head Chef",
                        "4": "Sous Chef",
                        "5": "Boson",
                        "6": "Purser",
                        "7": "Deck Hand",
                        "8": "Captain",
                        "9": "First Officer",
                        "10": "Second Officer",
                        "11": "Cheif Steward\/Stewardess",
                        "12": "Steward\/Stewardess"
                    },
                    mutliple: false,

                },
                {
                    title: 'TYPE OF BOAT',
                    type: 'radio',
                    name: 'boatType',
                    options: boatType,
                    mutliple: false,
                },
                {
                    title: 'duration',
                    type: 'radio',
                    name: 'jobDuration',
                    options: jobDuration,
                    mutliple: false,
                },
                {
                    title: 'start date',
                    type: 'date',
                    name: 'start_date',
                    mutliple: false,
                },
            ]
        },
        {
            title: 'Summary',
            questions: [
                {
                    title: 'Summary of the role',
                    type: 'form',
                    formfields: [
                        { label: '', type: 'text', name: 'Describe', placeholder: "Type details of the job here, dates, responsibilities, salary, location, experience required etc.", required: false }
                    ],
                    mutliple: false,

                },
                {
                    title: 'image',
                    type: 'form',
                    formfields: [
                        { label: '', type: 'image', name: 'Describe', placeholder: '', required: false }
                    ],
                    mutliple: false,
                },
                {
                    title: 'Search parameters',
                    type: 'form',
                    formfields: [
                        { label: '', type: 'select', name: 'myoption', placeholder: "", required: false },
                        { label: '', type: 'select', name: 'myoption', placeholder: "", required: false },
                        { label: '', type: 'select', name: 'myoption', placeholder: "", required: false },
                        { label: '', type: 'select', name: 'myoption', placeholder: "", required: false }
                    ],
                    mutliple: false,
                },
            ]
        },
        {
            title: 'The Boat',
            questions: [
                {
                    title: 'Vessel',
                    type: 'form',
                    formfields: [
                        { label: '', type: 'text', name: 'myoption', placeholder: "Describe the boat here.", required: false }
                    ],
                    mutliple: false,
                },
                {
                    title: 'Location',
                    type: 'radio',
                    name: 'boatLocation',
                    options: boatLocation,
                    mutliple: false,
                },
                {
                    title: 'Motor or sail',
                    type: 'radio',
                    name: 'boat',
                    options: ['Motor', 'sail'],
                    mutliple: false,
                },
                {
                    title: 'vessel Size',
                    name: 'vessel',
                    type: 'radio',
                    options: ['M'],
                    mutliple: false,
                }
            ]
        }
    ];

    return { steps, error, isLoading };
};