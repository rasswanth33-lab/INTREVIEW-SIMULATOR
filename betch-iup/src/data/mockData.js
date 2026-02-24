export const companies = [
    {
        id: "tcs",
        name: "TCS",
        logo: "T",
        roles: [
            { id: "frontend", title: "Frontend Developer", duration: "45 mins", questions: 10 },
            { id: "backend", title: "Backend Developer", duration: "45 mins", questions: 10 },
            { id: "data", title: "Data Analyst", duration: "30 mins", questions: 5 }
        ]
    },
    {
        id: "infosys",
        name: "Infosys",
        logo: "I",
        roles: [
            { id: "frontend", title: "Frontend Developer", duration: "40 mins", questions: 8 },
            { id: "fullstack", title: "Full Stack Developer", duration: "60 mins", questions: 12 }
        ]
    },
    {
        id: "zoho",
        name: "Zoho",
        logo: "Z",
        roles: [
            { id: "frontend", title: "Frontend Developer", duration: "45 mins", questions: 10 },
            { id: "sde", title: "Software Development Engineer", duration: "60 mins", questions: 12 }
        ]
    },
    {
        id: "amazon",
        name: "Amazon",
        logo: "A",
        roles: [
            { id: "sde1", title: "SDE I", duration: "60 mins", questions: 10 },
            { id: "frontend", title: "Frontend Engineer", duration: "60 mins", questions: 10 }
        ]
    },
    {
        id: "wipro",
        name: "Wipro",
        logo: "W",
        roles: [
            { id: "frontend", title: "Frontend Developer", duration: "45 mins", questions: 10 },
            { id: "backend", title: "Backend Developer", duration: "45 mins", questions: 10 }
        ]
    }
];

export const mockQuestions = {
    frontend: [
        { id: 1, text: "Explain the concept of Virtual DOM in React and how it improves performance." },
        { id: 2, text: "What are the differences between let, const, and var in JavaScript?" },
        { id: 3, text: "Can you explain CSS Flexbox vs CSS Grid? When would you use each?" },
        { id: 4, text: "What is Event Delegation in JavaScript? Why is it useful?" },
        { id: 5, text: "How do you handle state management in large React applications?" }
    ],
    backend: [
        { id: 1, text: "Explain RESTful API principles and standard HTTP methods." },
        { id: 2, text: "What is the difference between SQL and NoSQL databases?" },
        { id: 3, text: "How do you handle authentication and authorization in a web API?" },
        { id: 4, text: "Explain indexing in a database. How does it work under the hood?" },
        { id: 5, text: "What are microservices, and how do they compare strictly to monolithic architecture?" }
    ],
    data: [
        { id: 1, text: "Explain the difference between supervised and unsupervised learning." },
        { id: 2, text: "What are the different types of joins in SQL? Give examples." },
        { id: 3, text: "How do you handle missing or corrupted data in a dataset?" },
        { id: 4, text: "Explain the concept of p-value in hypothesis testing." },
        { id: 5, text: "What is the difference between classification and regression?" }
    ]
};
