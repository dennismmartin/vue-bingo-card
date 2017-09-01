(function () {
    'use strict';

    let winningCombos = [
        {"combo" : [0,1,2,3,4]},
        {"combo" : [5,6,7,8,9]},
        {"combo" : [10,11,12,13,14]},
        {"combo" : [15,16,17,18,19]},
        {"combo" : [20,21,22,23,24]},

        {"combo" : [0,5,10,15,20]},
        {"combo" : [1,6,11,16,21]},
        {"combo" : [2,7,12,17,22]},
        {"combo" : [3,8,13,18,23]},
        {"combo" : [4,9,14,19,24]},

        {"combo" : [0,6,12,18,24]},
        {"combo" : [4,8,12,16,20]},
        {"combo" : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]}
    ];

    let card = new Vue({
        el : '#app',
        data: {
            allItems: [],
            items: []
        },
        methods: {
            shuffle(array,amount) {
                console.log('Shuffle');
                var i = array.length,
                    tempValue,
                    randIndex;

                while (i > 0){
                    randIndex = Math.floor(Math.random() * i);
                    i -= 1;
                    tempValue          = array[i];
                    array[i]         = array[randIndex];
                    array[randIndex] = tempValue;
                }
                return array.slice(0,amount);
            },
            getNewCard(type) {
                console.log('getNewCard', type);
                this.items = this.shuffle(this.allItems,25);
                console.log(this.items.length);
                localStorage.setItem('currentCard', this.items);
            },
        },
        computed: {},
        watch: {},
        created() {
            console.log('Created');
            axios.get('data/bingoSquares.json')
                .then(response => {
                    this.allItems = response.data;
                    this.getNewCard('new');
                })
                .catch(e => {
                    console.log(e);
                    //this.errors.push(e);
                })
        }
    });


    function isWinningCombo() {
        return 'Called: isWinningCombo';
    }
    function isInArray(arr,obj){
        return (arr.indexOf(obj) >= 0);
    }



}());