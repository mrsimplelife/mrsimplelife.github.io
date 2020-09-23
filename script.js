// your code here

// DATA는 이미 작성된 트윗을 표시합니다.
// console.log(DATA)

// generateNewTweet을 호출할 때마다 새로운 트윗을 생성합니다.
// console.log(generateNewTweet());

// document.getElementById('test').innerHTML = 'hello twittler, check developer console!';

(function () {
    var template = document.importNode(document.querySelector('template').content, true);
    var commentList = document.querySelector('#comment-list');
    var tweetButton = document.querySelector('#tweet-button');
    var randomButton = document.querySelector('#random-button');
    var nameInput = document.querySelector('#name-input');
    var commentInput = document.querySelector('#comment-input');
    var warning = document.querySelector('#warning');

    showTweets(DATA);

    commentList.addEventListener('click', function (event) {
        if (event.target.className === 'comment__name') {
            data = DATA.filter(function (tweet) {
                return tweet.user === event.target.textContent;
            })
            showTweets(data);
        }
    });

    tweetButton.addEventListener('click', function () {
        if (nameInput.value && commentInput.value) {
            var tweet = createNewTweet(nameInput.value, commentInput.value)
            DATA.push(tweet);
            showTweets(DATA);
            clear();
        }
        else {
            warning.textContent = '이름과 내용이 필요합니다.';
        }
    });
    randomButton.addEventListener('click', function (event) {
        var tweet = generateNewTweet();
        tweet.created_at = tweet.created_at.format();
        DATA.push(tweet);
        showTweets(DATA);
    });


    function clear() {
        nameInput.value = '';
        commentInput.value = '';
        warning.textContent = '';
    }
    function createNewTweet(userName, comment) {
        var tweet = {};
        tweet.user = userName
        tweet.message = comment
        tweet.created_at = new Date().format();
        return tweet;
    }
    function showTweets(data) {
        commentList.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            showTweet(data[i]);
        }
    }
    function showTweet(tweet) {
        prepareLiClone(tweet);
        commentList.prepend(template.cloneNode(true));
    }
    function prepareLiClone(tweet) {
        template.querySelector('.comment__name').textContent = tweet.user;
        template.querySelector('.comment__text').textContent = tweet.message;
        template.querySelector('.comment__date').textContent = tweet.created_at;
    }
})();