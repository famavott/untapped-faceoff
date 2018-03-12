'use strict';

$(document).ready(function() {
    $('#main-btn').click(function(event) {
        let username = $('#username-search').val()

        $.ajax({
            type: 'POST',
            url: '/userinfo',
            dataType: 'json',
            data: {'username': JSON.stringify(username)},
            success: function(response) {
                console.log(response)
                localStorage.setItem('userinfo', JSON.stringify(response))
                $('.welcome').hide()
                renderBasicInfo()
                getAllBeers(username)
            },
            error: function(error) {
                console.log(error)
            }
        })
    })
});

function getAllBeers(username) {
    $.ajax({
        type: 'POST',
        url: '/userbeers',
        dataType: 'json',
        data: {'username': JSON.stringify(username)},
        success: function(response) {
          console.log(response)
        },
        error: function(error) {
            console.log(error)
        }
    })
}

function renderBasicInfo() {
    let userinfo = JSON.parse(localStorage['userinfo'])
    let username = userinfo['username']
    let location = userinfo['location']
    let totalBeers = userinfo['total_beers']
    let totalCheckins = userinfo['total_checkins']
    let friends = userinfo['friends']
    let avatar = userinfo['avatar']
    let badge = userinfo['recent_badge']
    let badgeDate = userinfo['recent_date']

    let table = `<table class="user-table">
            <tbody>
              <tr>
                <th scope="row">${username}</th>
                <td><img src=${avatar} alt="Avatar photo"></td>
              </tr>
              <tr>
                <th scope="row">Location:</th>
                <td>${location}</td>
              </tr>
              <tr>
                <th scope="row">Friends:</th>
                <td>${friends}</td>
              </tr>
              <tr>
                <th scope="row">Total Unique Beers:</th>
                <td>${totalBeers}</td>
              </tr>
              <tr>
                <th scope="row">Total Check-ins:</th>
                <td>${totalCheckins}</td>
              </tr>
              <tr>
                <th scope="row">Most Recent Badge:</th>
                <td>${badge}</td>
              </tr>
              <tr>
                <th scope="row">Most Recent Badge Date:</th>
                <td>${badgeDate}</td>
              </tr>
            </tbody>
          </table>`

    let welcome = `<a class="nav-link" href="#">Welcome, ${username}!</a>`
    $('.nav-link').hide()
    $('.nav-item').html(welcome)
    $('#user-card').html(table)
};

// let ctx = $("#time-graph");
// let timeChart = new Chart(ctx, {
//     type: 'pie',
//     data: {
//         labels: [],
//         datasets: [{
//             label: 'Beer Styles',
//             data: [12, 19, 3, 5, 2, 3],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)',
//                 'rgba(255, 159, 64, 0.2)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             yAxes: [{
//                 ticks: {
//                     beginAtZero:true
//                 }
//             }]
//         }
//     }
// });