// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'report_back') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        //alert("Message");
        //sendResponse(document.all[0].outerHTML);
        replaceKeywords(document.body);
        console.log('Done');
    }
});

var keywords = ['how', 'How', 'never', 'make', 'answer', 'case', 'error', 'game', 'Game'];

function replaceKeywords (domNode) {
    if (domNode.nodeType === Node.ELEMENT_NODE) { // We only want to scan html elements
        var children = domNode.childNodes;
        for (var i=0;i<children.length;i++) {
            var child = children[i];

            // Filter out unwanted nodes to speed up processing.
            // For example, you can ignore 'SCRIPT' nodes etc.
            if (child.nodeName != 'EM') {
                replaceKeywords(child); // Recurse!
            }
        }
    }
    else if (domNode.nodeType === Node.TEXT_NODE) { // Process text nodes
        var text = domNode.nodeValue;
        //console.log(text);
        // This is another place where it might be prudent to add filters
        var kwd = null;
        try{
	        for (var i=0;i<keywords.length;i++) {
	            let match = text.indexOf(keywords[i]); // you may use search instead
	            kwd = keywords[i];
	            //console.log(keywords[i]);
	            if (match != -1) {
	                // create the EM node:
	                let em = document.createElement('EM');
	                em.style.color = 'red';

	                // split text into 3 parts: before, mid and after
	                let mid = domNode.splitText(match);
	                mid.splitText(keywords[i].length);

	                // then assign mid part to EM
	                mid.parentNode.insertBefore(em,mid);
	                mid.parentNode.removeChild(mid);
	                em.appendChild(mid);
	            }
	        }
	    }catch(e){
	    	console.log('Error on keyword: ' + kwd);
	    }
    }
}