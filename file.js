fetch('https://wt.ops.labs.vu.nl/api23/93353ef9')
    .then(response => response.json())
    .then(data => {
        addAuthorBox(data, 0);
        updateTable(data, 0);
    })
    .catch(error => console.error('Error:', error))

function addSubmitData() {
    fetch('https://wt.ops.labs.vu.nl/api23/93353ef9')
        .then(response => response.json())
        .then(data => {
            updateTable(data, data.length - 1);
            addAuthorBox(data, data.length - 1)
        })
        .catch(error => console.error('Error:', error));
}
//adds submitted author to the table and the filter box.

function addAuthorBox(data, i = 0) {
    let authorBox = document.getElementById("filter-box");
    for (i; i < data.length; i++) {
        let navNode = document.createElement("button");
        navNode.id ="author-button";
        navNode.innerText = data[i].author;
        navNode.addEventListener("click", function () {
            let table = document.getElementById("table-id");
            while (table.rows.length > 2) {
                table.deleteRow(2);
            }
            let filteredData = data.filter(function (item) {
                return item.author === navNode.innerText;
            });
            updateTable(filteredData);
        });
        authorBox.children[0].appendChild(navNode);
    }
    window.scrollTo(0, 0);
}
//via stack overflow

const submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', function (event) {
    event.preventDefault();
    fetch('https://wt.ops.labs.vu.nl/api23/93353ef9')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            addSubmitData();
        })
        .catch(error => console.error('Error:', error));
    fetch('https://wt.ops.labs.vu.nl/api23/93353ef9', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            image: document.getElementById('image').value,
            author: document.getElementById('author').value,
            alt: document.getElementById('alt').value,
            tags: document.getElementById('tags').value,
            description: document.getElementById('description').value
        })
    }).then(res => {
        return res.json()
    })
        .then(data => console.log(data))
        .catch(error => console.log('ERROR'))
});

function updateTable(data, i = data.length - 1) {
    var table = document.getElementById("table-id");
    for (i; i < data.length; i++) {
        var row = table.insertRow(-1);
        var imageCell = row.insertCell(0);
        var authorCell = row.insertCell(1);
        var altCell = row.insertCell(2);
        var tagsCell = row.insertCell(3);
        var descriptionCell = row.insertCell(4);
        imageCell.innerHTML = '<img src=' + data[i].image + '>';
        authorCell.innerHTML = data[i].author;
        altCell.innerHTML = data[i].alt;
        tagsCell.innerHTML = data[i].tags;
        descriptionCell.innerHTML = data[i].description;
    }
}
// i is in the parameters so we can either add all elements 
// to the table (for example when opening the site), or add 
// the latest element when submiitting with i = data.length-1.

function resetAuthorBox() {
    let authorBox = document.getElementById("filter-box");
    for (let i = authorBox.children[0].children.length - 1; i >= 0; i--) {
        authorBox.children[0].removeChild(authorBox.children[0].children[i])
    }
    fetch('https://wt.ops.labs.vu.nl/api23/93353ef9')
        .then(response => response.json())
        .then(data => {
            addAuthorBox(data, 0);
        })
        .catch(error => console.error('Error:', error))
}
// this erases the buttons in the filter box and adds them back after resetting the api.

const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', function () {
    const table = document.getElementById("table-id");
    while (table.rows.length > 2) {
        table.deleteRow(2);
    }
    // deletes all rows except for the first one that contains the form.
    fetch('https://wt.ops.labs.vu.nl/api23/93353ef9/reset', {
    })
        .then(response => {
            console.log('Database reset');
        })
        .catch(error => {
            console.log('Error resetting database:', error);
        })
    fetch('https://wt.ops.labs.vu.nl/api23/93353ef9')
        .then(response => response.json())
        .then(data => {
            updateTable(data, 0);
            resetAuthorBox();
        })
        .catch(error => console.error('Error:', error))
});