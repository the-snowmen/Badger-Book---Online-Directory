// Source/Reference:
//1. https://stackoverflow.com/questions/71888792/start-searching-after-clicking-on-search-button
//2. https://www.w3schools.com/js/js_htmldom_eventlistener.asp

// Global variable to hold student data for search filtering
let allStudents = [];

// Fetch student data from the API
function fetchStudents() {
    fetch("https://cs571.org/api/s24/hw2/students", {
        headers: {
            "X-CS571-ID": CS571.getBadgerId()
        }
    })
    .then(response => response.json())
    .then(data => {
        allStudents = data; // Store fetched data for later use
        buildStudents(data); // Initially display all students
    })
    .catch(error => console.error('Error fetching student data:', error));
}

// Insert the student data into the HTML
function buildStudents(students) {
    const studentsContainer = document.getElementById('students');
    studentsContainer.innerHTML = ''; // Clear existing entries

    students.forEach(student => {
        // Create a container for each student
        const studentDiv = document.createElement('div');
		// Responsive classes for the screen display thing
        studentDiv.className = 'col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-4';

        // Name
        const name = document.createElement('h3');
        name.textContent = `${student.name.first} ${student.name.last}`;
        studentDiv.appendChild(name);

        // Major
        const major = document.createElement('p');
        major.textContent = `Major: ${student.major}`;
        studentDiv.appendChild(major);

        // Number of Credits
        const credits = document.createElement('p');
        credits.textContent = `Credits: ${student.numCredits}`;
        studentDiv.appendChild(credits);

        // From WI
        const fromWI = document.createElement('p');
        fromWI.textContent = student.fromWI ? 'From WI: Yes' : 'From WI: No';
        studentDiv.appendChild(fromWI);

        // Interests as an unordered list
		const interests = document.createElement('ul');
        student.interests.forEach(interest => {
            const item = document.createElement('li');
            item.textContent = interest;
            // Make each interest clickable
            item.style.cursor = 'pointer';
            item.addEventListener("click", (e) => {
                // Update the interest search input with the clicked interest
                document.getElementById('search-interest').value = e.target.innerText;
                // Rerun the search based on the new interest
                handleSearch(e);
            });
            interests.appendChild(item);
        });
        studentDiv.appendChild(interests);

        studentsContainer.appendChild(studentDiv);
    });

    document.getElementById('num-results').textContent = students.length;
}

// Search functionality
function handleSearch(e) {
    e.preventDefault(); // Prevent default form submission behavior

    // Gather input values, trim whitespace and converting to lower case for case-insensitive comparison
    const nameInput = document.getElementById('search-name').value.trim().toLowerCase();
    const majorInput = document.getElementById('search-major').value.trim().toLowerCase();
    const interestInput = document.getElementById('search-interest').value.trim().toLowerCase();

    // Filter the students array list
    const filteredStudents = allStudents.filter(student => {
        // Concatenate first and last name, then convert to lower case for comparison
        const fullName = `${student.name.first} ${student.name.last}`.toLowerCase();
        const major = student.major.toLowerCase();
        const interests = student.interests.map(interest => interest.toLowerCase());

        // Check if each input field is either blank or a substring of the relevant student property
        const nameMatch = !nameInput || fullName.includes(nameInput);
        const majorMatch = !majorInput || major.toLowerCase().includes(majorInput);
        const interestMatch = !interestInput || interests.some(interest => interest.includes(interestInput));

        // Return true if all conditions are met
        return nameMatch && majorMatch && interestMatch;
    });

    // Update the display and results count
    buildStudents(filteredStudents);
    document.getElementById('num-results').textContent = filteredStudents.length;
}

// This attach the search handler to the search button
document.getElementById("search-btn").addEventListener("click", handleSearch);


// This (also) attach the search handler to the search button click event
document.getElementById("search-btn").addEventListener("click", handleSearch);

// This fetch students data when the script loads
document.addEventListener('DOMContentLoaded', (event) => {
    fetchStudents();
});
