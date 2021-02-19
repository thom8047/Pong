class Board 
{
    constructor()
    {
        this.canvas = document.getElementById('sheet');
        this.context = this.canvas.getContext('2d');
    }
    start()
    {
        // do stuff
    }
}

class Pong 
{
    constructor(difficulty, uP, cP) 
    {
        this.difficulty = difficulty
        this.userPoints = uP;
        this.compPoints = cP;
        this.winner;

        this.game = new Board();
    }
    getMousePos(event, height)
    {
        var mouse_y = (event.clientY-10);
        var string = "Pos: " + mouse_y;
        document.getElementById('display').innerHTML = string;
        return mouse_y;//height);
    }
    getBallPos(position, current_y, comp_y)
    {
        var [x, y, x_dir, y_dir, speed] = position;
        if (x >= this.game.canvas.width)
        {
            if ((y-comp_y) > -25 && (y-comp_y) < 25)
            {
                var coin = Math.random(), dir;
                
                if (coin > 0.6) { y_dir = y_dir * 1 } else { y_dir = y_dir * -1 }
                x_dir = x_dir * -1;
            }
            else 
            {
                this.winner = 'user';
                return false;
            }
        }
        else if (x <= 0)
        {
            if ((y-current_y) > -25 && (y-current_y) < 25)
            {
                var coin = Math.random(), dir;
                
                if (coin > 0.6) { y_dir = y_dir * 1 } else { y_dir = y_dir * -1 }
                x_dir = x_dir * -1;
                speed += (Math.random() * 0.25);
                //console.log(speed, (y-current_y));
            }
            else 
            {
                //console.log(y-current_y);
                this.winner = 'comp';
                return false;
            }
        }
        x = x + (speed * (2) * x_dir)

        if (y >= this.game.canvas.height)
        {
            y_dir = y_dir * -1;
        }
        else if (y <= 0)
        {
            y_dir = y_dir * -1;
        }
        y = y + (speed * (2) * y_dir)


        return [x, y, x_dir, y_dir, speed];

    }
    render(context, current_y, canvas, ball_x, ball_y, comp_y)
    {
        var x = 0, y = current_y, len = 50;
        //canvas
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        context.fillRect(canvas.width/2, 0, 3, canvas.height);
        context.fillStyle = 'white';
        context.fillRect(canvas.width/2, 20, 3, canvas.height/10);
        context.fillStyle = 'white';
        context.fillRect(canvas.width/2, 100, 3, canvas.height/10);
        context.fillStyle = 'white';
        context.fillRect(canvas.width/2, 180, 3, canvas.height/10);
        context.fillStyle = 'white';
        context.fillRect(canvas.width/2, 260, 3, canvas.height/10);
        context.fillStyle = 'white';
        context.fillRect(canvas.width/2, 340, 3, canvas.height/10);

        context.fillStyle = 'black';
        context.fillText("User: " + this.userPoints, canvas.width/3, canvas.height/4);
        context.fillStyle = 'black';
        context.fillText("Com: " + this.compPoints, canvas.width*(2/3), canvas.height/4);
        //user
        context.fillStyle = 'black';
        context.fillRect(x, y-(len/2), 8, len);
        //enemy
        context.fillStyle = 'black';
        context.fillRect(canvas.width-8, comp_y-(len/2), 8, len);
        //ball
        context.beginPath();
        context.arc(ball_x, ball_y, 10, 0, Math.PI*2);
        context.fill();
    }
    start()
    {
        var _self = this; //Work around for dealing with setinterval
        var canvas = this.game.canvas;
        var context = this.game.context;
        var game_int;
        var mouse_y, current_y = 0, dampening = 20, time = 10, ball_origin = [canvas.width/2, canvas.height/2, -1, 1, 1], comp_y = 0, comp_dampening = 20;
        setTimeout(() => {
            this.game.canvas.onmousemove = function(event) 
            {
                mouse_y = _self.getMousePos(event, canvas.height);
                //console.log(Math.abs(mouse_y-current_y));
            }
        }, 0);
        // getUserPos
        setInterval(() => {
            if (mouse_y > current_y){
                var diff = (Math.abs(mouse_y-current_y)/dampening);
                current_y += diff;
            }
            else if (mouse_y < current_y){
                var diff = (Math.abs(mouse_y-current_y)/dampening);
                current_y -= diff;
            }
            // getCompPos
            if ((ball_origin[0] > canvas.width/2) && (ball_origin[2] == 1))
            {
                if (ball_origin[1] > comp_y)
                {
                    var diff = (Math.abs(ball_origin[1]-comp_y)/comp_dampening);
                    comp_y += diff;
                }
                else if (ball_origin[1] < comp_y)
                {
                    var diff = (Math.abs(ball_origin[1]-comp_y)/comp_dampening);
                    comp_y -= diff;
                }
            }
        });
        return new Promise((resolve, reject) => 
        {
            game_int = setInterval(() => {
                ball_origin = this.getBallPos(ball_origin, current_y, comp_y)
                if (ball_origin == false)
                {
                    clearInterval(game_int);
                    //console.log(this.winner);
                    resolve(this.winner);
                }
                this.render(context, current_y, canvas, ball_origin[0], ball_origin[1], comp_y)
            }, time);
        });
    }
}

class Game
{
    constructor(difficulty, max_points)
    {
        this.diff = difficulty;
        this.uP = 0;
        this.cP = 0;
        this.max = max_points;
        // this.winner = false;
        this.pong = new Pong(this.diff, this.uP, this.cP);
    }

    startGame()
    {
        this.pong.start()
        .then(response => 
            {
                var timer, time = 3, winner = [false, ''];

                if (response == 'comp') 
                {
                    this.pong.compPoints += 1;
                    if (this.pong.compPoints == this.max) {winner[0] = true; winner[1] = response;}
                }
                else if (response == 'user')
                {
                    this.pong.userPoints += 1;
                    if (this.pong.userPoints == this.max) {winner[0] = true; winner[1] = response;}
                }
                console.log(winner[0])
                if (!(winner[0]))
                {
                    this.pong.game.context.fillStyle = 'white';
                    this.pong.game.context.fillRect(0, 0, this.pong.game.canvas.width, this.pong.game.canvas.height);
                    timer = setInterval(() => 
                    {
                        time -= 0.1;
                        
                        this.pong.game.context.fillStyle = 'white';
                        this.pong.game.context.fillRect(0, 0, this.pong.game.canvas.width, this.pong.game.canvas.height);

                        this.pong.game.context.fillStyle = 'black';
                        this.pong.game.context.fillText('Winner: ' + response, this.pong.game.canvas.width/2, this.pong.game.canvas.height/2);
                        this.pong.game.context.fillText('New game begins in: ' + time.toFixed(1), this.pong.game.canvas.width/2, this.pong.game.canvas.height/1.5);
                    }, 100);
                    setTimeout(() => 
                    {
                        clearInterval(timer)
                        this.startFullGame();
                    }, (time*1000));
                }
                else
                {
                    this.pong.game.context.fillStyle = 'white';
                    this.pong.game.context.fillRect(0, 0, this.pong.game.canvas.width, this.pong.game.canvas.height);

                    this.pong.game.context.fillStyle = 'black';
                    this.pong.game.context.fillText('Game Winner: ' + response + '!', this.pong.game.canvas.width/2, this.pong.game.canvas.height/2);
                }
            });
    }

    startFullGame()
    {
        this.startGame();
    }
}

game = new Game('easy', 7);
game.startFullGame();

//pong.start();
