class Game 
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
    constructor(difficulty) 
    {
        this.difficulty = difficulty

        this.game = new Game();
    }
    getMousePos(event, height)
    {
        var mouse_y = (event.clientY-10);
        var string = "Pos: " + mouse_y;
        document.getElementById('display').innerHTML = string;
        return mouse_y;//height);
    }
    getBallPos(position, current_y)
    {
        var [x, y, x_dir, y_dir, speed] = position;
        if (x >= this.game.canvas.width)
        {
            x_dir = x_dir * -1;
        }
        else if (x <= 0)
        {
            if ((y-current_y) > -25 && (y-current_y) < 25)
            {
                x_dir = x_dir * -1;
                speed += (Math.random() * 0.25);
                console.log(speed, (y-current_y));
            }
            else 
            {
                console.log(y-current_y);
                return false;
            }
        }
        x = x + (speed * x_dir)

        if (y >= this.game.canvas.height)
        {
            y_dir = y_dir * -1;
        }
        else if (y <= 0)
        {
            y_dir = y_dir * -1;
        }
        y = y + (y_dir)


        return [x, y, x_dir, y_dir, speed];

    }
    render(context, current_y, canvas, ball_x, ball_y)
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
        //user
        context.fillStyle = 'black';
        context.fillRect(x, y-(len/2), 8, len);
        //enemy
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
        var mouse_y, current_y = 0, dampening = 20, time = 10, ball_origin = [canvas.width/2, canvas.height/2, -1, 1, 1];
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
        });

        game_int = setInterval(() => {
            ball_origin = this.getBallPos(ball_origin, current_y)
            if (ball_origin == false)
            {
                clearInterval(game_int);
                console.log('end')
            }
            this.render(context, current_y, canvas, ball_origin[0], ball_origin[1])
        }, time);
    }
}

pong = new Pong('easy');
pong.start();
//pong.start();
