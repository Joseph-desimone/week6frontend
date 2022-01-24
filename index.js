class Movie {
    constructor(name) {
        this.name = name;
        this.actors = [];
    }

    addActor(name, age) {
        this.actors.push(new Actor(name, age));
    }
}

class Actor{
    constructor(name, age){
        this.name = name;
        this.age = age;
    }
}

class MovieService {
    static url = '';

    static getAllMovies() {
        return $.get(this.url);
    }
    
    static getMovie(id) {
        return $.get(this.url + `/${id}`);  
    }

    static createMovie(movie) {
        return $.post(this.url);
    }

    static updateMovie(movie) {
        return $.ajax({
            url: this.url + `/${movie._id}`,
            dataType: 'json',
            data: JSON.stringify(movie),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteMovie(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });

    }
}

class DOMManager {
    static movies;

    static getAllMovies() {
        MovieService.getAllMovies().then(movies => this.render(movies));
    }

    static createMovie(name) {
        MovieService.createMovie(new Movie(name))
            .then((res) => {
                console.log(res)
                return MovieService.getAllMovies();
            })
            .then((movies) => this.render(movies));
    }

    static deleteMovie(id) {
        MovieService.deleteMovie(id)
            .then(() => {
                return MovieService.getAllMovies();
            })
            .then((movies) => this.render(movies));
    }

    static addActor(id) {
        for (let movie of this.movies) {
            if(movie._id == id) {
                movie.ages.push(new Actor($(`#${movie._id}-age-name`).val(), $(`#${movie._id}-age-name`).val()));
                MovieService.updateMovie(movie) 
                    .then(() => {
                        return MovieService.getAllMovies();
                    })
                    .then((movies) => this.render(movies));
            }
        }
    }

    static deleteActor(movieId, actorId) {
        for (let movie of this.movies) {
            if (movie._id == movieId) {
                for (let actor of movie.actors) {
                    if(actor.id_ == actorId) {
                        movie.actors.splice(movie.actors.indexOf(actor), 1);
                        MovieService.updateMovie(movie)
                            .then(() => {
                                return MovieService.getAllMovies();
                            })
                            .then((movies) => this.render(movies))
                    }
                }
            }
        }
    }

    static render(movies) {
        this.movies = movies;
        $('#app').empty();
        for (let movie of movies) {
            $('#app').prepend(
            `<div id="${movie._id}" class="card">
                <div class="card-header">
                  <h2>${movie.name}</h2>
                  <button class="btn btn-danger" onclick="DOMManager.deleteMovie('${movie._id}')">Delete</button>
                </div>
                <div class="card-body">
                <div class="card">
                    <div class="row">
                        <div class="col-sm">
                            <input type="text" id="${movie._id}-actor-name" class ="form-control" placeholder="Actor Name">
                        </div>
                        <div class"col-sm">
                            <input type="text" id="${movie._id}-actor-age" class ="form-control" placeholder="Actor Age">
                     </div>
                </div>
                <button id="${movie._id}-new-actor" onclick="DOMManager.addActor('${movie._id})" class="btn btn-primary form-control">Add</button>
            </div>
        </div>
    </div><br>`
    );
    for (let actor of movie.actors) {
        $(`#${movie._id}`).find('.card-body').append(
            `<p>
            <span id="name-${actor._id}"><strong>Name: </strong> ${actor.name}</span>
            <span id="age-${actor._id}"><strong>Age: </strong> ${actor.age}</span>
            <button class="btn btn-danger" onclick="DOMManager.deleteActor('${movie._id}', '${actor._id}')">Delete Actor</button>`
            );
        }
    }
    }
}

$('#create-new-movie').click(() => {
    DOMManager.createMovie($('#new-movie-name').val());
    $('#new-movie-name').val('');
})
DOMManager.getAllMovies();