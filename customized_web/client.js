
const user_id = crypto.randomUUID();
const key = "860d159d-3728-47d6-b8d5-473a698205e6"

function divination_start(hexagram, question){
    // 定义请求的URL
    const url = 'http://127.0.0.1:8000/divination/start';

    // 创建将要发送的数据
    const data = {
        key: key,
        user_id: user_id,
        hexagram: hexagram,
        question: question
    };

    // 使用fetch API发起POST请求
    fetch(url, {
    method: 'POST', // 指定请求方法为POST
    headers: {
        'Content-Type': 'application/json', // 指定发送的数据类型为JSON
    },
    body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
    })
    .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
    })
    .then(data => {
    build_talk_box(data.master)
    })
    .catch(error => {
    alert(error);
    });
}

function divination_confusion(question){
    // 定义请求的URL
    const url = 'http://127.0.0.1:8000/divination/consult';

    // 创建将要发送的数据
    const data = {
        key: key,
        user_id: user_id,
        question: question
    };

    // 使用fetch API发起POST请求
    fetch(url, {
    method: 'POST', // 指定请求方法为POST
    headers: {
        'Content-Type': 'application/json', // 指定发送的数据类型为JSON
    },
    body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
    })
    .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
    })
    .then(data => {
    build_talk_box(data.master)
    })
    .catch(error => {
    alert(error);
    });
}


function remove_talk_box(){
    let talk_box = document.getElementById("talk_box");
    talk_box.remove();
}

function build_talk_box(ai_message){
    root_div = document.getElementById("root_page");

    let talk_box = document.createElement("div");
    talk_box.setAttribute("id", "talk_box");
    talk_box.setAttribute("class", "flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl max-w-screen-md");

    let topic = document.createElement("p");
    topic.textContent = "段乾坤所述"
    topic.setAttribute("class", "text-2xl text-center text-neutral-900");

    let ai_text = document.createElement("p");
    ai_text.setAttribute("id", "ai_text");
    ai_text.textContent = ai_message;
    ai_text.setAttribute("class", "text-lg text-center text-neutral-900");

    let user_text = document.createElement("textarea");
    user_text.setAttribute("id", "user_text");
    user_text.setAttribute("class", "text-center text-neutral-900 w-4/5 rounded-lg shadow-md");

    let submit_button = document.createElement("button");
    submit_button.setAttribute("id", "submitButton_for_confution");
    submit_button.setAttribute("class", "text-lg text-center text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-8 py-2 rounded-lg shadow-md");
    submit_button.textContent = "请示";

    talk_box.appendChild(topic);
    talk_box.appendChild(ai_text);
    talk_box.appendChild(user_text);
    talk_box.appendChild(submit_button);
    root_div.appendChild(talk_box);

    let but2 = document.getElementById("submitButton_for_confution");
    but2.addEventListener("click", get_divination_confusion);
}


function rebuild_page(hexagram_result, confusion_text){

    let talk_box = document.getElementById("talk_box");
    talk_box.remove();
    divination_start(hexagram_result, confusion_text);
}

function get_confusion_and_hexagram(){

    let hexagram_list = ["hexagram1", "hexagram2", "hexagram3", "hexagram4", "hexagram5", "hexagram6"];
    let hexagram_result = "";
    let confusion_text;

    let confusion_elem = document.getElementById("confusion_text");
    confusion_text = confusion_elem.value;

    hexagram_list.forEach(function(hexagram_id){
        checkbox = document.getElementById(hexagram_id);
        if (checkbox.checked){
            hexagram_result += "阳";
        } else {
            hexagram_result += "阴";
        }
    });

    rebuild_page(hexagram_result, confusion_text);
}

function get_divination_confusion(){
    let confusion_elem = document.getElementById("user_text");
    let confusion_text = confusion_elem.value;

    let talk_box = document.getElementById("talk_box");
    talk_box.remove();
    divination_confusion(confusion_text);
}

let but = document.getElementById("submitButton_for_hexagram");
but.addEventListener("click", get_confusion_and_hexagram);
