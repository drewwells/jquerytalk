(function(){

    var articles = document.querySelectorAll('article'),
        state = {
            current: 0,
            increment: 10,
            path: "",
            update: function( state ){
                this.current = state;
                window.history.pushState( {}, null, this.path + "slide" + this.current );
            },
            get: function(){
                return this.current;
            }
        },
        body = document.querySelector( "body" ),
        onload = window.location.pathname.split( 'slide' );

    for( var i = 1, l = articles.length; i < l; i++ ){

        articles[ i ].className = 'future';
    }

    state.path = onload[0];

    if( onload.length > 1 ){

        state.current = parseInt( onload[1], 10 );
        articles[ 0 ].className = "past";
        if( state.current >= articles.length || state.current < 0 ){
            state.update( 0 );
        };

        articles[ state.current ].className = "current";
        state.update( state.current );

        if( state.current ){

            for( i = 0, l = state.current; i < l; i++ ){

                articles[ i ].className = "past";
            }
        }

    }

    document.addEventListener( 'touchstart', touch );
    document.addEventListener( 'touchmove', touch );
    document.addEventListener( 'touchend', touch );

    var dragging, start, end, delta, distance = window.screenX / 2;

    function touch( event ){

        var type = event.type, change;
        if( type !== "touchmove" ){

            if( !dragging ){

                start = event.pageX;
            }
            dragging = !dragging;
        } else if( dragging ){

            change = event.pageX - start;

            if( Math.abs( Math.floor( change / distance ) ) > 0 ) {

                start = event.pageX;
                change > 0 ? changePage( 'Left' ) : changePage( 'Right' );
            }

        }
    };

    //Sometimes you got to time travel
    function timeTravel( ){

        var str;
        for( var i = 0; i < articles.length; i++ ){

            str = articles[ i ].className;
            if( str != 'current' ){

                articles[ i ].className = str === "future" ? "past" : "future";
            }
        }
    }
    document.onkeydown = function( ev ){


        if( !ev.keyIdentifier ){

            switch( ev.keyCode ){

                case 38:
                    ev.keyIdentifier = 'Top';
                        break;
                case 39:
                    ev.keyIdentifier = 'Right';
                    break;
                case 40:
                    ev.keyIdentifier = 'Bottom';
                    break;
                case 37:
                    ev.keyIdentifier = 'Left';
                    break;
            }
        }

        changePage( ev.keyIdentifier );
    };

    function changePage( keyStroke ){

        var current = document.querySelectorAll( 'article' )[ state.current ],
            far;

        if( state.current % 2 ){

            body.className = "";
        } else {

            body.className = "odd";
        }
        switch( keyStroke ){

            case "Left":
                if( !current.previousElementSibling ){

                    current.parentNode.lastElementChild.className = "past no-transition";
                    //ARGH!

                    current.parentNode.lastElementChild.className = "current";
                    timeTravel();
                    state.update( current.parentNode.children.length - 1 );

                } else {

                    current.previousElementSibling.className = "current";
                    state.update( --state.current );
                }
            current.className = "future";
            return false;
            break;

            case "Right":
            if( !current.nextElementSibling ){
                current.parentNode.children[0].className = "future";
                setTimeout(function(){
                    current.parentNode.children[0].className = "current";
                },4);
                state.update( 0 );
                timeTravel();
            } else {
                current.nextElementSibling.className = "current";
                state.update( ++state.current );
            }
            current.className = "past";
            return false;

            break;

            case "Down":

                if( state.current + state.increment < articles.length ){

                    articles[ state.current ].className = "far-future no-transition";
                    articles[ state.current ].className = "far-future";
                    for( i = state.current + 1, l = state.current + state.increment; i < l; i++ ){

                        articles[ i ].className = "past";
                    }
                    (function(){

                        var current = state.current;
                        setTimeout(function(){

                            articles[ current ].classList.remove( "far-future" );
                            if( !articles[ current ].classList.contains( "current" ) ){

                                articles[ current ].className = "past";
                            }

                        }, 1300);
                    })();

                    state.update( state.current + state.increment );
                    articles[ state.current ].className = "far-past no-transition";

                }

            break;

            case "Up":

                if( state.current > 4 ){

                    articles[ state.current ].className = "far-past no-transition";
                    articles[ state.current ].className = "far-past";
                    for( i = state.current - state.increment, l = state.current; i < l; i++ ){

                        articles[ i ].className = "future";
                    }
                    (function(){
                        var current = state.current;
                        setTimeout(function(){

                            articles[ current ].classList.remove( "far-past" );
                            if( !articles[ current ].classList.contains( "current" ) ){
                                articles[ current ].className = "future";
                            }
                        }, 1300);
                    })();
                    state.update( state.current - state.increment );
                    articles[ state.current ].className = "far-future no-transition";

                }


            break;
        };

        if( articles[ state.current ].classList.contains( "far-future" )
        || articles[ state.current ].classList.contains( "far-past" )  ){

            setTimeout(function(){
                articles[ state.current ].className = "current";
            }, 100 );
        }
        return true;
    };

})();