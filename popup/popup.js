document.addEventListener(
    "DOMContentLoaded",
    () => {
        const transBtn = document.getElementById("translateBtn");
        const bigBtn = document.getElementById("BigBtn");
        const smallBtn = document.getElementById("SmallBtn");
        // const recoverBtn = document.getElementById("RecoverBtn");

        // transBtn.addEventListener("click", () => {
        //     console.log("click");
        //     chrome.tabs.query(
        //         { active: true, lastFocusedWindow: true },
        //         (tabs) => {
        //             chrome.tabs.sendMessage(
        //                 tabs[0].id,
        //                 { method: "translate" }
        //             )
        //         }
        //     )
        // })
        // bigBtn.addEventListener("click", () => {
        //     console.log("click");
        //     chrome.tabs.query(
        //         { active: true, lastFocusedWindow: true },
        //         (tabs) => {
        //             chrome.tabs.sendMessage(
        //                 tabs[0].id,
        //                 { method: "Bigger" }
        //             )
        //         }
        //     )
        // })
        // smallBtn.addEventListener("click", () => {
        //     console.log("click");
        //     chrome.tabs.query(
        //         { active: true, lastFocusedWindow: true },
        //         (tabs) => {
        //             chrome.tabs.sendMessage(
        //                 tabs[0].id,
        //                 { method: "Smaller" }
        //             )
        //         }
        //     )
        // })
        // recoverBtn.addEventListener("click", () => {
        //     chrome.tabs.query(
        //         { active: true, currentWindow: ture },
        //         (tabs) => {
        //             chorme.tabs.sendMessage(
        //                 tabs[0].id,
        //                 { method: "Recover" }
        //             )
        //         }
        //     )
        // })
        transBtn.addEventListener("click", () => {
            (async () => {
                const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
                console.log(tab);
                const response = await chrome.runtime.sendMessage(tab.id, { method: "translate" });
                console.log(response);
            })();
        });
        bigBtn.addEventListener("click", () => {
            (async () => {
                const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
                const response = await chrome.runtime.sendMessage(tab.id, { method: "Bigger" });
                console.log(response);
            })();
        });
        smallBtn.addEventListener("click", () => {
            (async () => {
                const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
                const response = await chrome.runtime.sendMessage(tab.id, { method: "Smaller" });
                console.log(response);
            })();
        });


    }
)