function Bigger() {
    const currentSubtitleSize = 100;
    const newSubtitleSize = currentSubtitleSize + 10;
    var css = 'video::-webkit-media-text-track-display {font-size: ' + newSubtitleSize + '%;}',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
}

function Smaller() {
    const currentSubtitleSize = 100;
    const newSubtitleSize = currentSubtitleSize - 10;
    var css = 'video::-webkit-media-text-track-display {font-size: ' + newSubtitleSize + '%;}',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
}

async function translate() {
    let tracks = document.getElementsByTagName("track");
    let en;
    let zh;
    if (tracks.length) {
        for (let i = 0; i < tracks.length; i++) {
            if (tracks[i].srclang == "en") {
                en = tracks[i];
            }
            if (tracks[i].srclang == "zh") {
                zh = tracks[i];
            }
        }
    }
    if (en) {
        en.track.mode = "showing"
        if (zh) {
            zh.track.mode = "showing"
        } else {
            await sleep(500);
            let cuses = en.track.cues;
            const cuesTextList = getCuesTextList(cues);
            for (let i = 0; i < cuesTextList.length; i++) {
                getTranslation(cuesTextList[i][1], translatedText => {
                    const translatedTextList = translatedText.split('\n\n')
                    for (let j = 0; j < translatedTextList.length; j++) {
                        cues[cuesTextList[i][0] + j].text += '\n' + translatedTextList[j]
                    }
                })
            }
        }

    }
}

function getCuesTextList(cues) {
    // 取出字幕的所有文本内容，整合成为一个列表
    // 每项为不大于 5000 字的字符串，（好像目前使用的这个 API 有 5000 字上限？）
    // 以及它在 cues 的起始位置
    // 返回的数据结构大概是 [[0, 文本], [95, 文本]]
    let cuesTextList = []
    for (let i = 0; i < cues.length; i++) {
        if (cuesTextList.length &&
            cuesTextList[cuesTextList.length - 1][1].length +
            cues[i].text.length < 5000) {
            // 需要插入一个分隔符(换行)，以便之后为翻译完的字符串 split
            // 用两个换行符来分割，因为有的视频字幕是自带换行符
            cuesTextList[cuesTextList.length - 1][1] += '\n\n' + cues[i].text
        } else {
            cuesTextList.push([i, cues[i].text])
        }
    }
    return cuesTextList
}

function getTranslation(words, callback) {
    // 通过谷歌翻译 API 进行翻译，输入待翻译的字符串，返回翻译完成的字符串
    const xhr = new XMLHttpRequest()
    let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh&dt=t&q=${encodeURI(words)}`
    xhr.open('GET', url, true)
    xhr.responseType = 'text'
    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200 || xhr.status === 304) {
                // 返回的翻译文本大概是
                // [[["你好。","hello.",null,null,1],["你好","hello",null,null,1]],null,"en"]
                // 这样的字符串
                // 需要将结果拼接成完整的整段字符串
                const translatedList = JSON.parse(xhr.responseText)[0]
                let translatedText = ''
                for (let i = 0; i < translatedList.length; i++) {
                    translatedText += translatedList[i][0]
                }
                callback(translatedText)
            }
        }
    }
    xhr.send()
}

chrome.runtime.onMessage.addListener(
    function (request, sender, response) {
        if (sender.tab && sender.tab.active) {
            if (request.method == "translate") {
                console.log("translate");
                translate();
                sendResponse({ farewell: "goodbye" });
            }
            if (request.method == "Bigger") {
                Bigger();
            }
            if (request.method == "Smaller") {
                Smaller();
            }
        }
    }
)