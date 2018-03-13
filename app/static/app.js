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
          $('.graph-area').removeClass('hidden')
          getRatingData(response)
          timeChart.update()
        },
        error: function(error) {
            console.log(error)
        }
    })
};

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

const beer_ratings = []
const ratings_count = []

function getRatingData(response) {
  let ratings = []
  let counts = {}
  for(let item in response) {
    ratings.push(response[item].rating_score)
  }
  for(let i = 0; i < ratings.length; i++) {
    if(!counts.hasOwnProperty(ratings[i])) {
      counts[ratings[i]] = 1
    } else {
      counts[ratings[i]]++
    }
  }
  for(let [key, value] of Object.entries(counts)) {
    beer_ratings.push(parseInt(key))
    ratings_count.push(value)
  }
  console.log(beer_ratings)
  console.log(ratings_count)
};

const beer_styles = []
const styles_count = []

function getStyleData(response) {
  let styles = []
  let counts = {}
  for(let item in response){
    styles.push(response[item].beer.beer_style)
  }
  for(let i = 0; i < styles.length; i++) {
    if (!counts.hasOwnProperty(styles[i])) {
      counts[styles[i]] = 1
    } else {
      counts[styles[i]]++
    }
  }
  for(let [key, value] of Object.entries(counts)) {
    beer_styles.push(key)
    styles_count.push(value)
  }
  console.log(beer_styles)
  console.log(styles_count)
};

let randomColorFactor = function() {
  return (Math.round(Math.random() * 255))
};

// let ctx = $("#style-graph");
// let timeChart = new Chart(ctx, {
//     type: 'pie',
//     data: {
//         labels: beer_styles,
//         datasets: [{
//             label: 'Beer Styles',
//             data: styles_count,
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)',
//                 'rgba(255, 159, 64, 0.2)',
//                 'rgba(200, 68, 67, 0.2)',
//                 'rgba(155, 170, 80, 0.2)',
//                 'rgba(23, 42, 64, 0.2)',
//                 'rgba(110, 200, 34, 0.2)',
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)',
//                 'rgba(200, 68, 67, 0.2)',
//                 'rgba(155, 170, 80, 0.2)',
//                 'rgba(255, 159, 64, 0.2)',
//                 'rgba(23, 42, 64, 0.2)',
//                 'rgba(110, 200, 34, 0.2)',
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

let ctx = $("#style-graph");
let timeChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: beer_ratings,
        datasets: [{
            label: '# of Reviews by Rating',
            data: ratings_count,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(200, 68, 67, 0.2)',
                'rgba(155, 170, 80, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(200, 68, 67, 0.2)',
                'rgba(155, 170, 80, 0.2)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});