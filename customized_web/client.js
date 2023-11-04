

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
    submit_button.setAttribute("id", "submitButton");
    submit_button.setAttribute("class", "text-lg text-center text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-8 py-2 rounded-lg shadow-md");
    submit_button.textContent = "请示";

    talk_box.appendChild(topic);
    talk_box.appendChild(ai_text);
    talk_box.appendChild(user_text);
    talk_box.appendChild(submit_button);
    root_div.appendChild(talk_box);
}


function rebuild_page(){

    let page1 = document.getElementById("page1");
    page1.remove();

    build_talk_box("各位朋友们，听我说，听我说，千万不要小看了周易的威力哦！今天早上，我一揭开《易经》，突然间风云变色，只见电脑屏幕上跳出了三个字：‘更新提示’。我沉思良久，灵光一闪，决定用‘随机卦’应对这一变故。于是乎，左手一挥，三枚硬币在桌面上跳跃如同活泼的小兔，最终竟然呈现出了‘坤为地’的六连阴——这不是告诉我要‘地响’（坚守）等待，不要轻举妄动么？结果，我按损损吾道——也就是不更新，继续我的工作。没想到，不一会儿，电脑就自己开始更新了。看来这‘天机’也是会开小差，偶尔搞个小更新来提醒我们：即便是易经大师，也要记得电脑的自动更新功能是打开的呀！哈哈，记得啊，同学们，做人做事，除了看天意，也别忘了看看‘系统设置’哦！");

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
            hexagram_result += "正";
        } else {
            hexagram_result += "负";
        }
    });

    // alert(hexagram_result);
    // alert(confusion_text);
    rebuild_page();
}

let but = document.getElementById("submitButton");
but.addEventListener("click", get_confusion_and_hexagram);
