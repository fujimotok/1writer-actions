var content = editor.getText(); // テキスト全体
var lines = content.split('\n'); // lineに分解
var linesLength = lines.length; // line数
var lengths = 0; // テキスト全体での位置
var headings = Array(); // 見出しと位置
var filteredHeadings = Array(); // 見出しと位置
var listings = Array(); // 画面表示用
var filterLevel = 1;
var i;

// 見出しと見出し位置を正規表現で抽出
for(i = 0; i < linesLength; i++) {
    if(lines[i].match(/^#+\s?.*/)) {
        headings.push({heading: lines[i], position: lengths, index: headings.length});
    }
    lengths += lines[i].length + 1; // +1 because the line breaks count;
}

// 見出しがなければエラー出して終了
if (headings.length < 0) {
    ui.hudError("There's no heading");
    return;
}

function callback(selectedItem, selectedIndex) {
    if (selectedIndex === undefined) {
        ui.hudError("Don't jump then");
        return;
    }

    filterLevel++;
    var currentHeading = listings[Number(selectedIndex)].index;
    var current = filteredHeadings.findIndex(elem => elem.index == listings[Number(selectedIndex)].index);
    var next = (Number(selectedIndex) + 1) < listings.length
        ? filteredHeadings.findIndex(elem => elem.index == listings[Number(selectedIndex) + 1].index)
        : filteredHeadings.length - 1;

    filteredHeadings = filteredHeadings.slice(current, next);
    
    listings = filteredHeadings.filter(heading => (heading.heading.match(/^#+/g)[0].match(/#/g) || []).length == filterLevel);

    if (listings.length == 0)
    {
        editor.setSelectedRange(headings[currentHeading].position);
        return;
    }

    ui.list('Jump to Section', listings.map(item => item.heading), false, callback);
}

listings = headings.filter(heading => (heading.heading.match(/^#+/g)[0].match(/#/g) || []).length == filterLevel)
filteredHeadings = headings.slice();
ui.list('Jump to Section', listings.map(item => item.heading), false, callback);
