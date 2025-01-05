(function () {
    function removeElement(selector) {
        var element = document.querySelector(selector);
        if (element) {
            element.remove();
            console.log(`${selector} removed.`);
        }
    }

    function removeUnwantedElements() {
        removeElement('.terms-agreement');
        removeElement('#app-stores-container');
    }

    document.addEventListener('DOMContentLoaded', removeUnwantedElements);

    var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                removeUnwantedElements();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
function createDraggableWindow() {
    const container = document.createElement('div');
    container.id = 'altgen-container';
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.left = '10px';
    container.style.width = '300px';
    container.style.backgroundColor = 'rgb(20 20 20)';
    container.style.borderRadius = '10px';
    container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    container.style.color = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.zIndex = '10000';

    const titleBar = document.createElement('div');
    titleBar.style.backgroundColor = 'rgb(15 15 15)';
    titleBar.style.padding = '10px';
    titleBar.style.cursor = 'move';
    titleBar.style.borderTopLeftRadius = '10px';
    titleBar.style.borderTopRightRadius = '10px';
    titleBar.style.display = 'flex';
    titleBar.style.alignItems = 'center';
    titleBar.style.justifyContent = 'space-between';

    const titleText = document.createElement('span');
    titleText.textContent = 'AltGen v3 Diagnostics';

    const closeButton = document.createElement('div');
    closeButton.style.width = '15px';
    closeButton.style.height = '15px';
    closeButton.style.backgroundColor = 'rgb(15, 15, 15)';
    closeButton.style.borderRadius = '50%';
    closeButton.style.cursor = 'pointer';
    closeButton.style.transition = 'transform 0.2s';

    closeButton.onclick = () => {
        container.style.transform = 'scale(0)';
        setTimeout(() => {
            container.remove();
        }, 200);
    };

    titleBar.appendChild(titleText);
    titleBar.appendChild(closeButton);
    container.appendChild(titleBar);

    const content = document.createElement('div');
    content.style.padding = '10px';

    const line1 = document.createElement('p');
    line1.textContent = 'Birthday: N/A';
    line1.id = 'birthdayStatus';

    const line2 = document.createElement('p');
    line2.textContent = 'Username: N/A';
    line2.id = 'usernameStatus';

    const line3 = document.createElement('p');
    line3.textContent = 'Password: N/A';
    line3.id = 'passwordStatus';

    content.appendChild(line1);
    content.appendChild(line2);
    content.appendChild(line3);

    container.appendChild(content);
    document.body.appendChild(container);

    let isDragging = false;
    let offsetX, offsetY;

    titleBar.onmousedown = (e) => {
        isDragging = true;
        offsetX = e.clientX - container.offsetLeft;
        offsetY = e.clientY - container.offsetTop;
    };

    document.onmousemove = (e) => {
        if (isDragging) {
            container.style.left = `${e.clientX - offsetX}px`;
            container.style.top = `${e.clientY - offsetY}px`;
        }
    };

    document.onmouseup = () => {
        isDragging = false;
    };

    // Attempt to set the birthday fields
    const setBirthdayFields = () => {
        const statusElement = document.getElementById('birthdayStatus');
        let ran = false;
        let success = true;

        try {
            const yearDropdown = document.querySelector('#YearDropdown');
            const monthDropdown = document.querySelector('#MonthDropdown');
            const dayDropdown = document.querySelector('#DayDropdown');

            if (yearDropdown && monthDropdown && dayDropdown) {
                ran = true;

                yearDropdown.value = '2000';
                dispatchChangeEvent(yearDropdown);
                monthDropdown.value = 'Dec';
                dispatchChangeEvent(monthDropdown);
                dayDropdown.value = '25';
                dispatchChangeEvent(dayDropdown);

                // Verify if the fields were set correctly
                if (yearDropdown.value === '2000' && monthDropdown.value === 'Dec' && dayDropdown.value === '25') {
                    statusElement.textContent = 'Birthday';
                    statusElement.style.color = 'green';
                } else {
                    success = false;
                    statusElement.textContent = 'Birthday: ERR';
                    statusElement.style.color = 'red';
                }
            } else {
                statusElement.textContent = 'Birthday: N/A';
                statusElement.style.color = 'yellow';
            }
        } catch (error) {
            success = false;
            statusElement.textContent = 'Birthday: ERR';
            statusElement.style.color = 'red';
        }
    };

    const setUsernameAndPassword = () => {
        const usernameStatusElement = document.getElementById('usernameStatus');
        const passwordStatusElement = document.getElementById('passwordStatus');
        let usernameSet = false;
        let passwordSet = false;

        try {
            const usernameInput = document.querySelector('#signup-username');
            const passwordInput = document.querySelector('#signup-password');

            if (usernameInput && passwordInput) {
                const username = generateRandomText();
                simulateUserInput(usernameInput, username);
                simulateUserInput(passwordInput, username + username);

                if (usernameInput.value === username) {
                    usernameStatusElement.textContent = 'Username';
                    usernameStatusElement.style.color = 'green';
                    usernameSet = true;
                } else {
                    usernameStatusElement.textContent = 'Username: ERR';
                    usernameStatusElement.style.color = 'red';
                }

                if (passwordInput.value === username + username) {
                    passwordStatusElement.textContent = 'Password';
                    passwordStatusElement.style.color = 'green';
                    passwordSet = true;
                } else {
                    passwordStatusElement.textContent = 'Password: ERR';
                    passwordStatusElement.style.color = 'red';
                }
            } else {
                if (!usernameInput) {
                    usernameStatusElement.textContent = 'Username: N/A';
                    usernameStatusElement.style.color = 'yellow';
                }
                if (!passwordInput) {
                    passwordStatusElement.textContent = 'Password: N/A';
                    passwordStatusElement.style.color = 'yellow';
                }
            }
        } catch (error) {
            if (!usernameSet) {
                usernameStatusElement.textContent = 'Username: ERR';
                usernameStatusElement.style.color = 'red';
            }
            if (!passwordSet) {
                passwordStatusElement.textContent = 'Password: ERR';
                passwordStatusElement.style.color = 'red';
            }
        }
    };

    const dispatchChangeEvent = (element) => {
        const event = new Event('change', { bubbles: true });
        element.dispatchEvent(event);
    };

    const simulateUserInput = (inputElement, value) => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(inputElement, value);
        const inputEvent = new Event('input', { bubbles: true });
        inputElement.dispatchEvent(inputEvent);
    };

    const generateRandomText = () => {
        const list1 = [
            "the", "be", "and", "of", "a", "in", "to", "have", "it", "I",
            "that", "for", "you", "he", "with", "on", "do", "say", "this", "they",
            "at", "but", "we", "his", "from", "not", "by", "she", "or", "as",
            "what", "go", "their", "can", "who", "get", "if", "would", "her", "all",
            "my", "make", "about", "know", "will", "as", "up", "one", "time", "there",
            "year", "so", "think", "when", "which", "them", "some", "me", "people", "take",
            "out", "into", "just", "see", "him", "your", "come", "could", "now", "than",
            "like", "other", "how", "then", "its", "our", "two", "more", "these", "want",
            "way", "look", "first", "also", "new", "because", "day", "more", "use", "no",
            "man", "find", "here", "thing", "give", "many", "well", "only", "those", "tell",
            "one", "very", "her", "even", "back", "any", "good", "woman", "through", "us",
            "life", "child", "work", "down", "may", "after", "should", "call", "world", "over",
            "school", "still", "try", "last", "ask", "need", "too", "feel", "three", "when",
            "state", "never", "become", "between", "high", "really", "something", "most", "another", "much",
            "family", "own", "out", "leave", "put", "old", "while", "mean", "on", "keep",
            "student", "why", "let", "great", "same", "big", "group", "begin", "seem", "country",
            "help", "talk", "where", "turn", "problem", "every", "start", "hand", "might", "American",
            "show", "part", "about", "against", "place", "over", "such", "again", "few", "case",
            "most", "week", "company", "where", "system", "each", "right", "program", "hear", "so",
            "question", "during", "work", "play", "government", "run", "small", "number", "off", "always",
            "move", "like", "night", "live", "Mr", "point", "believe", "hold", "today", "bring",
            "happen", "next", "without", "before", "large", "all", "million", "must", "home", "under",
            "water", "room", "write", "mother", "area", "national", "money", "story", "young", "fact",
            "month", "different", "lot", "right", "study", "book", "eye", "job", "word", "though",
            "business", "issue", "side", "kind", "four", "head", "far", "black", "long", "both",
            "little", "house", "yes", "since", "provide", "service", "around", "friend", "important", "father",
            "sit", "away", "until", "power", "hour", "game", "often", "yet", "line", "political",
            "end", "among", "ever", "stand", "bad", "lose", "however", "member", "pay", "law",
            "meet", "car", "city", "almost", "include", "continue", "set", "later", "community", "much",
            "name", "five", "once", "white", "least", "president", "learn", "real", "change", "team",
            "minute", "best", "several", "idea", "kid", "body", "information", "nothing", "ago", "right",
            "lead", "social", "understand", "whether", "back", "watch", "together", "follow", "around", "parent",
            "only", "stop", "face", "anything", "create", "public", "already", "speak", "others", "read",
            "level", "allow", "add", "office", "spend", "door", "health", "person", "art", "sure",
            "war", "history", "party", "within", "grow", "result", "open", "morning", "walk", "reason",
            "low", "win", "research", "girl", "guy", "early", "food", "moment", "himself", "air",
            "teacher", "force", "offer", "enough", "education", "across", "although", "remember", "foot", "second",
            "boy", "maybe", "toward", "able", "age", "off", "policy", "everything", "love", "process",
            "music", "including", "consider", "appear", "actually", "buy", "probably", "human", "wait", "serve",
            "market", "die", "send", "expect", "home", "sense", "build", "stay", "fall", "nation",
            "plan", "cut", "college", "interest", "death", "course", "someone", "experience", "behind", "reach",
            "local", "kill", "six", "remain", "effect", "use", "yeah", "suggest", "class", "control",
            "raise", "care", "perhaps", "little", "late", "hard", "field", "else", "pass", "former",
            "sell", "major", "sometimes", "require", "along", "development", "themselves", "report", "role", "better",
            "economic", "effort", "decide", "rate", "strong", "possible", "heart", "drug", "leader", "light",
            "voice", "wife", "whole", "police", "mind", "finally", "pull", "return", "free", "military",
            "price", "report", "less", "according", "decision", "explain", "son", "hope", "even", "develop",
            "view", "relationship", "carry", "town", "road", "drive", "arm", "true", "federal", "break",
            "difference", "thank", "receive", "value", "international", "building", "action", "full", "model", "join",
            "season", "society", "tax", "director", "early", "position", "player", "agree", "especially", "record",
            "pick", "wear", "paper", "special", "space", "ground", "form", "support", "event", "official",
            "whose", "matter", "everyone", "center", "couple", "site", "end", "project", "hit", "base",
            "activity", "star", "table", "need", "court", "produce", "eat", "teach", "oil", "half",
            "situation", "easy", "cost", "industry", "figure", "street", "image", "itself", "phone", "either",
            "data", "cover", "quite", "picture", "clear", "practice", "piece", "land", "recent", "describe",
            "product", "doctor", "wall", "patient", "worker", "news", "test", "movie", "certain", "north",
            "love", "personal", "open", "support", "simply", "third", "technology", "catch", "step", "baby",
            "computer", "type", "attention", "draw", "film", "Republican", "tree", "source", "red", "nearly",
            "organization", "choose", "cause", "hair", "century", "evidence", "window", "difficult", "listen", "soon",
            "culture", "billion", "chance", "brother", "energy", "period", "course", "summer", "less", "realize",
            "hundred", "available", "plant", "likely", "opportunity", "term", "short", "letter", "condition", "choice",
            "place", "single", "rule", "daughter", "administration", "south", "husband", "Congress", "floor", "campaign",
            "material", "population", "well", "call", "economy", "medical", "hospital", "church", "close", "thousand",
            "risk", "current", "fire", "future", "wrong", "involve", "defense", "anyone", "increase", "security",
            "bank", "myself", "certainly", "west", "sport", "board", "seek", "per", "subject", "officer",
            "private", "rest", "behavior", "deal", "performance", "fight", "throw", "top", "quickly", "past",
            "goal", "second", "order", "author", "represent", "focus", "foreign", "drop", "blood", "upon",
            "agency", "push", "nature", "color", "no", "recently", "store", "reduce", "sound", "note",
            "fine", "before", "near", "movement", "page", "enter", "share", "common", "poor", "natural",
            "race", "concern", "series", "significant", "similar", "hot", "language", "each", "usually", "response",
            "dead", "rise", "animal", "factor", "decade", "article", "shoot", "east", "save", "seven",
            "artist", "scene", "stock", "career", "despite", "central", "eight", "thus", "treatment", "beyond",
            "happy", "exactly", "protect", "approach", "lie", "size", "dog", "fund", "serious", "occur",
            "media", "ready", "sign", "thought", "list", "individual", "simple", "quality", "pressure", "accept",
            "answer", "hard", "resource", "identify", "left", "meeting", "determine", "prepare", "disease", "whatever",
            "success", "argue", "cup", "particularly", "amount", "ability", "staff", "recognize", "indicate", "character",
            "growth", "loss", "degree", "wonder", "attack", "herself", "region", "television", "box", "TV",
            "training", "pretty", "trade", "deal", "election", "everybody", "physical", "lay", "general", "feeling",
            "standard", "bill", "message", "fail", "outside", "arrive", "analysis", "benefit", "name", "sex",
            "forward", "lawyer", "present", "section", "environmental", "glass", "answer", "skill", "sister", "PM",
            "professor", "operation", "financial", "crime", "stage", "ok", "compare", "authority", "miss", "design",
            "sort", "one", "act", "ten", "knowledge", "gun", "station", "blue", "state", "strategy",
            "little", "clearly", "discuss", "indeed", "force", "truth", "song", "example", "democratic", "check",
            "environment", "leg", "dark", "various", "rather", "laugh", "guess", "executive", "prove", "hang",
            "entire", "rock", "design", "enough", "forget", "since", "claim", "note", "remove", "manager",
            "help", "close", "sound", "enjoy", "network", "legal", "religious", "cold", "form", "final",
            "main", "science", "green", "memory", "card", "above", "seat", "cell", "establish", "nice",
            "trial", "expert", "that", "spring", "firm", "Democrat", "radio", "visit", "management", "care",
            "avoid", "imagine", "tonight", "huge", "ball", "finish", "yourself", "theory", "impact", "respond",
            "statement", "maintain", "charge", "popular", "traditional", "onto", "reveal", "direction", "weapon", "employee",
            "cultural", "contain", "peace", "head", "control", "base", "pain", "apply", "play", "measure",
            "wide", "shake", "fly", "interview", "manage", "chair", "fish", "particular", "camera", "structure",
            "politics", "perform", "bit", "weight", "suddenly", "discover", "candidate", "top", "production", "treat",
            "trip", "evening", "affect", "inside", "conference", "unit", "style", "adult", "worry", "range",
            "mention", "deep", "edge", "specific", "writer", "trouble", "necessary", "throughout", "challenge", "fear",
            "shoulder", "institution", "middle", "sea", "dream", "bar", "beautiful", "property", "instead", "improve",
            "stuff", "claim", "code", "attention", "sheet", "ought", "machine", "length", "planning", "join",
            "fresh", "traditional", "female", "in", "whereas", "square", "resolve", "voter", "prison", "ride",
            "guard", "terms", "demand", "reporter", "deliver", "text", "share", "tool", "wild", "vehicle",
            "observe", "flight", "inside", "facility", "understanding", "average", "emerge", "advantage", "quick", "light",
            "leadership", "earn", "pound", "basis", "bright", "operate", "guest", "sample", "contribute", "tiny",
            "block", "protection", "settle", "feed", "collect", "additional", "while", "highly", "identity", "title",
            "mostly", "lesson", "faith", "river", "promote", "living", "present", "count", "unless", "marry",
            "tomorrow", "technique", "path", "ear", "shop", "folk", "order", "principle", "survive", "lift",
            "border", "competition", "jump", "gather", "limit", "fit", "claim", "cry", "equipment", "worth",
            "associate", "critic", "warm", "aspect", "result", "insist", "failure", "annual", "French", "Christmas",
            "comment", "responsible", "affair", "approach", "until", "procedure", "regular", "spread", "chairman", "baseball",
            "soft", "ignore", "egg", "belief", "demonstrate", "anybody", "murder", "gift", "religion", "review",
            "editor", "past", "engage", "coffee", "document", "speed", "cross", "influence", "anyway", "threaten",
            "commit", "female", "youth", "wave", "move", "afraid", "quarter", "background", "native", "broad",
            "wonderful", "deny", "apparently", "slightly", "reaction", "twice", "suit", "perspective", "growing", "blow",
            "construction", "kind", "intelligence", "destroy", "cook", "connection", "charge", "burn", "shoe", "view",
            "grade", "context", "committee", "hey", "mistake", "focus", "smile", "location", "clothes", "Indian",
            "quiet", "dress", "promise", "aware", "neighbor", "complete", "drive", "function", "bone", "active",
            "extend", "chief", "average", "combine", "wine", "below", "cool", "voter", "mean", "demand",
            "learning", "bus", "hell", "dangerous", "remind", "moral", "United", "category", "relatively", "victory",
            "academic", "Internet", "healthy", "negative", "following", "historical", "medicine", "tour", "depend", "photo",
            "finding", "grab", "direct", "classroom", "contact", "justice", "participate", "daily", "fair", "pair",
            "famous", "exercise", "knee", "flower", "tape", "hire", "familiar", "appropriate", "supply", "fully",
            "cut", "will", "actor", "birth", "search", "tie", "democracy", "eastern", "primary", "yesterday",
            "circle", "device", "progress", "front", "bottom", "island", "exchange", "clean", "studio", "train",
            "lady", "colleague", "application", "neck", "lean", "damage", "plastic", "tall", "plate", "hate",
            "otherwise", "writing", "press", "male", "start", "alive", "expression", "football", "intend", "attack",
            "chicken", "army", "abuse", "theater", "shut", "map", "extra", "session", "danger", "welcome",
            "domestic", "lots", "literature", "rain", "desire", "assessment", "injury", "respect", "northern", "nod",
            "paint", "fuel", "leaf", "direct", "Chinese", "cook", "chemical", "sugar", "fake", "circumstance",
            "easy", "laugh", "experiment", "mouth", "repeat", "alone", "finger", "apartment", "bend", "cell",
            'Sky', 'Mystic', 'Shadow', 'Crimson', 'Solar', 'Nebula', 'Lunar', 'Pixel',
            'Quantum', 'Nova', 'Echo', 'Frost', 'Cosmic', 'Blaze', 'Phantom', 'Azure',
            'Glitch', 'Vortex', 'Titan', 'Aether', 'Obsidian', 'Cinder', 'Nimbus',
            'Mirage', 'Phoenix', 'Falcon', 'Rogue', 'Viper', 'Zenith', 'Spectre',
            'Inferno', 'Spectra', 'Striker', 'Vertex', 'Eclipse', 'Pulse', 'Gale',
            'Aurora', 'Tempest', 'Nexus', 'Blitz', 'Fusion', 'Zenith', 'Pyro', 'Spire',
            'Volt', 'Ember', 'Talon', 'Wraith', 'Glimmer', 'Chaos', 'Drift', 'Thorn',
            'Bane', 'Onyx', 'Fury', 'Ember', 'Raven', 'Ember', 'Haze', 'Pheon',
            'Vector', 'Delta', 'Fang', 'Lyric', 'Rune', 'Hex', 'Shroud', 'Blizzard',
            'Dusk', 'Storm', 'Rune', 'Volt', 'Fable', 'Ember', 'Glare', 'Shade',
            'Ridge', 'Whisper', 'Sable', 'Dawn', 'Storm', 'Glare', 'Haven', 'Tide',
            'Crest', 'Comet', 'Pyre', 'Shade', 'Ashen', 'Flare', 'Radiance', 'Wisp',
            'Thorn', 'Horizon', 'Ember', 'Gust', 'Rune', 'Shiver', 'Spike', 'Aura',
            'Tik', 'Aura', 'Crashout', 'Rizz', 'Livvy', 'Dun', 'Duke', 'Dennis', "Ohio",
            'Glint', 'Nash', 'Vex', 'Shade', 'Wisp', 'Spectra', 'Haze', 'Kite', 'Zephyr', 'Surge', 'Blaze', 'Rift', 'Echo', 'Storm', 'Crest', 'Volt', 'Frost', 'Flame',
            'Pulse', 'Ember', 'Inferno', 'Glare', 'Shade', 'Lunar', 'Nova', 'Spire', 'Mirage', 'Haze',
            'Nimbus', 'Vortex', 'Quasar', 'Aether', 'Pyre', 'Blitz', 'Echo', 'Comet', 'Raven', 'Eclipse',
            'Phantom', 'Aurora', 'Zenith', 'Spectre', 'Titan', 'Cinder', 'Spectra', 'Obsidian', 'Dawn', 'Lyric',
            'Radiance', 'Glimmer', 'Tempest', 'Bane', 'Gale', 'Wraith', 'Nebula', 'Flare', 'Blizzard', 'Talon'

        ];

        const list2 = [
            '', '', '', '_', 'x', 'z', 'q', '_x', '_z', 'xx', 'zz', 'xz', 'zx',
            'qx', 'zx', 'loves', 'with', 'and', 'vs', 'on', '_vs', '_and', '_with',
            'xwith', 'zwith', 'qwith', 'xand', 'zand', 'qand', '_loves', '_on',
            '_in', 'xin', 'zin', 'qin', 'xvs', 'zvs', 'qvs', 'xvs_', 'zvs_',
            'qvs_', 'onx', 'onz', 'onq', 'withx', 'withz', 'withq', 'andx',
            'andz', 'andq', '_withx', '_withz', '_withq', 'xxand', 'zzand',
            'xzand', 'zxand', '_onx', '_onz', '_onq', 'lovesx', 'lovesz', 'lovesq',
            'onwith', 'withand', 'onand', 'withvs', 'andvs', 'onvs', 'invs',
            'inwith', 'inand', 'inloves', 'loveswith', 'lovesand', 'onloves',
            "olive", "butter", "love"
        ];

        const list3 = [
            'hunter', 'legend', 'warrior', 'mystic', 'slayer', 'seeker', 'shadow',
            'storm', 'blade', 'ghost', 'knight', 'raider', 'rider', 'venom', 'flare',
            'frost', 'reaper', 'spark', 'cypher', 'drift', 'echo', 'strike',
            'vengeance', 'ranger', 'vision', 'scout', 'shift', 'rage', 'force',
            'pulse', 'phantom', 'druid', 'savage', 'fury', 'prowler', 'wrath',
            'flame', 'curse', 'alpha', 'sentinel', 'dragoon', 'harbinger', 'gale',
            'ninja', 'whisper', 'valkyrie', 'tyrant', 'warden', 'prowler', 'skull',
            'revenant', 'witch', 'oracle', 'warlock', 'maiden', 'spear', 'berserker',
            'magus', 'juggernaut', 'swordsman', 'guardian', 'executioner', 'lich',
            'warrior', 'samurai', 'assassin', 'necromancer', 'banshee', 'herald',
            'beast', 'gladiator', 'noble', 'archer', 'diviner', 'seer', 'wizard',
            'dragon', 'sage', 'hero', 'champion', 'sage', 'behemoth', 'raven',
            'wizard', 'seer', 'herald', 'priest', 'templar', 'archmage', 'knight',
            'juggler', 'lich', 'gargoyle', 'arbiter', 'avatar', 'titan', 'colossus',
            'ravager', 'zealot', 'nightmare', 'seraph', 'wrath', 'angel', 'reaver',
            'inferno', 'stormbringer', 'grim', 'vortex', 'shroud', 'wraith', 'daemon',
            'shade', 'serpent', 'omen', 'phoenix', 'enigma', 'nova', 'dread',
            'vanguard', 'hex', 'talon', 'riptide', 'quake', 'plague', 'warden',
            'fury', 'eclipse', 'havoc', 'onyx', 'specter', 'vengeance', 'mirage',
            'outlaw', 'brute', 'jinx', 'revenge', 'relic', 'famine', 'silence',
            'chaos', 'ravage', 'arcanist', 'sphinx', 'hunter', 'marshal', 'recon',
            'knightmare', 'furious', 'howl', 'bane', 'necro', 'scythe', 'spectral',
            'wrathful', 'celestial', 'demon', 'anarchy', 'envoy', 'helix', 'torment',
            'dusk', 'brimstone', 'tempest', 'viper', 'enchant', 'hellhound', 'siren',
            'saber', 'claw', 'brawler', 'hunter', 'predator', 'leviathan', 'trickster',
            'rune', 'fallen', 'doom', 'nightshade', 'ominous', 'spectral', 'gale',
            'shiver', 'blood', 'hollow', 'warden', 'barbarian', 'daemon', 'frostbite',
            'blade', 'summoner', 'chaos', 'warden', 'eclipse', 'tundra', 'vigil',
            'emperor', 'haunt', 'infernal', 'hellfire', 'rogue', 'bloodlust', 'torch',
            'raider', 'shadowfang', 'titan', 'blackout', 'equinox', 'inquisitor', 'oblivion',
            'nomad', 'moon', 'scourge', 'bane', 'thunder', 'obsidian', 'sever', 'reaper',
            'cyclone', 'legion', 'mauler', 'phantasm', 'wildfire', 'azrael', 'keeper',
            'brigand', 'havoc', 'spirit', 'ranger', 'doomslayer', 'warden', 'striker',
            'flare', 'vortex', 'eclipse', 'maelstrom', 'pyro', 'thorn', 'rampage',
            'redeemer', 'sentry', 'vigilante', 'myst', 'warden', 'hellion', 'lightning',
            'wild', 'raze', 'demise', 'nightfall', 'trance', 'reborn', 'dusk', 'cleaver',
            'reaver', 'anubis', 'valiant', 'warden', 'tundra', 'hunter', 'recon', 'zephyr',
            'envy', 'phantom', 'nox', 'ember', 'ash', 'ward', 'wrath', 'void', 'eagle',
            'stalker', 'warden', 'falcon', 'specter', 'hound', 'tide', 'thunder',
            'warrior', 'phantom', 'ember', "69", "metal", "Gems", ".rarity", "smores"
        ];

        const rareWords = [
            'addiqute', 'seriph', 'coruze', 'vibant', 'florux', 'zephyx', 'nirvos',
            'quazic', 'myntho', 'cyrene', 'kylith', 'drakum', 'pharyx', 'syntra',
            'lyrith', 'vertox', 'zorven', 'xanthe', 'quorix', 'vanyth', 'nytrox',
            'zaryn', 'cryptos', 'faylix', 'razion', 'strixum', 'oryphe', 'jynque',
            'talyx', 'voryx', 'myrthos', 'zanith', 'xalith', 'feryss', 'ixtren',
            'graven', 'sorvex', 'voxen', 'quorim', 'myrven', 'cyrix', 'norvyn',
            'xylith', 'trynix', 'zaryn', 'kythir', 'drovyn', 'zypher', 'vorlun',
            'xantho', 'pharynx', 'nirvax', 'quoryn', 'lydrin', 'sylar', 'vorlen',
            'xenith', 'nythos', 'zyven', 'pythos', 'nyxrin', 'vyrnix', 'quorin',
            'lyrith', 'xornix', 'trynth', 'vorlux', 'zythir', 'dyntho', 'phylith',
            'synth', 'noryx', 'zylith', 'trynx', 'xandor', 'voryth', 'phynix',
            'nalyth', 'zymir', 'kythos', 'dorvix', 'xalor', 'phorix', 'nalith',
            'zymoth', 'korvyn', 'xylor', 'pyrix', 'noryx', 'zylor', 'vynth',
            'xandor', 'phyrith', 'koryx', 'dorven', 'zymor', 'nalor', 'korvyn',
            'xyrith', 'trynor', 'vorlan', 'zymos', 'pythor', 'doryn', 'zythos',
            'xylith', 'trymor', 'voryth', 'xandro', 'phynor', 'nalox', 'zymoth',
            'koryth', 'dorven', 'zythen', 'lythar', 'xandro', 'vynthor', 'zymos',
            'koryth', 'dorvan', 'zythar', 'xalith', 'tryvor', 'vorlyn', 'zymon',
            'phyrin', 'nalyn', 'zyloth', 'xandro', 'vynthor', 'zymen', 'lythos',
            'xynor', 'koryn', 'dorvix', 'zyther', 'naloth', 'xarnoth', 'vynthor',
            'zymir', 'phyrin', 'nalor', 'zylith', 'xylor', 'trython', 'vorlin',
            'zymor', 'xynor', 'koryx', 'dorven', 'zythox', 'nalor', 'korven',
            'xanthor', 'phyrith', 'nalor', 'zymith', 'korvan', 'xornith', 'phynar',
            'nalor', 'zymor', 'korvan', 'xaroth', 'voryn', 'xanthor', 'phynar',
            'nalith', 'zymor', 'korvan', 'xanith', 'vorlyn', 'zymar', 'phyrith',
            'nalor', 'zymar', 'korvan', 'xaroth', 'voryn', 'xanthar', 'phynar',
            'nalith', 'zymar', 'korvan', 'xornath', 'phorix', 'nalor', 'zymar',
            'korvyn', 'xaroth', 'vorlyn', 'xanthor', 'phynar', 'nalith', 'zymar',
            'koryx', 'dorven', 'zythar', 'xanith', 'vorlin', 'zymar', 'phyrin',
            'nalor', 'zymar', 'korvyn', 'xornith', 'phorix', 'nalor', 'zymar',
            'koryn', 'dorvan', 'zythar', 'xanith', 'vorlyn', 'zymar', 'phyrin',
            'nalor', 'zymar', 'korvyn', 'xornith', 'phorix', 'nalor', 'zymar',
            'clavix', 'drithor', 'valyph', 'zoryth', 'nylorn', 'crynox', 'voraxin',
            'thoryx', 'zypherin', 'morthan', 'pyrixen', 'xantrix', 'vorynex', 'phylor',
            'lymor', 'quynith', 'drovix', 'xyran', 'korythos', 'zylorn', 'phynith',
            'xyntra', 'vornyx', 'mythros', 'zythrax', 'drayven', 'kylor', 'zorvex',
            'pythra', 'noxith', 'zymorix', 'xylorn', 'vorluxen', 'dorynx', 'zyrinth',
            'phorvyn', 'naryn', 'xantros', 'vorynth', 'mynthor', 'quorven', 'lydrith',
            'zorvenyx', 'nithor', 'zymirith', 'thoryn', 'kryntor', 'zylvex', 'vorynx',
            'phynorix', 'cythran', 'vorath', 'zydrin', 'xalvyn', 'trymorix', 'norvix',
            'vynthos', 'zytharix', 'pharynth', 'drovynth', 'quorinex', 'xornyx',
            'naryl', 'zymithor', 'krylen', 'vorathos', 'zymorix', 'lyntar', 'zorvanth',
            'quaryx', 'xynthor', 'pharnyx', 'norynth', 'zymorin', 'cythrax', 'vorynix',
            'thorin', 'zythran', 'mynthar', 'dorynx', 'xylorin', 'pharvyn', 'nalynth',
            'vorith', 'zythron', 'quaryth', 'xalynth', 'dravyn', 'zylorin', 'vorluxith',
            'thorynth', 'pythrin', 'zymith', 'vorlorn', 'xanvyn', 'zorinth', 'narynth',
            'zymorx', 'korvinth', 'xylornith', 'vynthorix', 'zorynth', 'moryx', 'quarth',
            'xanryth', 'phornyx', 'naryx', 'zymorith', 'vorynxith', 'thorinx', 'zylorix',
            'carynth', 'noxvyn', 'voranth', 'zytharon', 'xynthar', 'pharvinth', 'dranthos',
            'vorlynx', 'xalryth', 'korynith', 'vorlinth', 'thynix', 'zylorith', 'vorinthar',
            'xaloryx', 'phorynth', 'nythrin', 'zymorith', 'quorthan', 'xalven', 'korynthos',
            'vornyxith', 'myntharix', 'zythoran', 'pythral', 'dorith', 'xylithen', 'zorathor',
            'norith', 'zymarix', 'vorlen', 'xyntharix', 'thynor', 'zylorinex', 'voranix',
            'zythoren', 'korvynith', 'xylanth', 'pharynix', 'nymor', 'vorlinith', 'zythronix',
            'quarvyn', 'xandroth', 'phorynxith', 'vorlornith', 'zylarix', 'korvynex', 'xylonith',
            'voranthor', 'zythonix', 'kylorn', 'xylorinth', 'vornyxithen', 'zylorinth', 'phornyxith',
            'nymorin', 'vorlornyx', 'zylarith', 'quarvynith', 'xantryn', 'phorynith', 'vorlithen',
            'zymorithen', 'corynith', 'xylonithor', 'vornyth', 'zytharonix', 'thynorix', 'xylorithen',
            'voranixor', 'zymarin', 'quarvinth', 'xantrithor', 'phornyxor', 'nymarix', 'vorlorny'
        ];
        const letters = 'abcdefghijklmnopqrstuvwxyz';

        const usedUsernames = JSON.parse(localStorage.getItem('usedUsernames')) || [];

        function saveUsernameToLog(username) {
            usedUsernames.push(username);
            localStorage.setItem('usedUsernames', JSON.stringify(usedUsernames));
        }

        function isUsernameUsed(username) {
            return usedUsernames.includes(username);
        }

        let username;
        do {
            if (Math.random() > 0.5) {
                const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
                username = getRandomItem(list1) + getRandomItem(list2) + getRandomItem(list3);
            } else {
                const rareWord = rareWords[Math.floor(Math.random() * rareWords.length)];
                const randomLetters = Array.from({ length: 2 + Math.floor(Math.random() * 2) }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
                username = rareWord + randomLetters;
            }
        } while (isUsernameUsed(username) || username.startsWith('_') || username.length < 3 || username.length > 20);

        saveUsernameToLog(username);
        return username;
    };

    setBirthdayFields();
    setUsernameAndPassword();
}

const currentUrl = window.location.href.toLowerCase();
const validUrls = [
    'https://www.roblox.com/',
    'https://www.roblox.com/createaccount'
];

if (validUrls.some(url => currentUrl.startsWith(url)) || currentUrl.includes('createaccount')) {
    createDraggableWindow();
}