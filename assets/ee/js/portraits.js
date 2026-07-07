// 16x16 pixel dialog portraits, one per character, rendered once to a
// data URL and cached. Only people (and former people) get faces —
// narration, chests, items, and system messages stay text-only.

const PORTRAITS = {
    'Frances Antone': {
        palette: {
            h: '#1A1414', G: '#9A9A9A', s: '#B5754A', e: '#241408',
            n: '#9A5F3A', m: '#7A4530', t: '#2E8B8B',
        },
        rows: [
            "................",
            "....hhhhhhhh....",
            "..hhhhhhhhhhhh..",
            ".hGhhhhhhhhhhhh.",
            ".hGssssssssssh..",
            ".hhssssssssssh..",
            ".hhseessseessh..",
            ".hhssssssssssh..",
            ".hhsssnnsssssh..",
            ".hhssssssssssh..",
            "..hsssmmmmsss...",
            "..hssssssssss...",
            "...ssssssss.....",
            "..tt.ssssss.tt..",
            ".tttttttttttttt.",
            "tttttttttttttttt",
        ],
    },
    'Vance Cutler': {
        palette: {
            H: '#E8DCC0', k: '#4A3A28', s: '#D9A066', e: '#241408',
            n: '#B5754A', m: '#6E3A20', W: '#F0EAD8', r: '#C8A868',
            b: '#2A2A2A', q: '#40C4B0',
        },
        rows: [
            "....HHHHHHHH....",
            "...HHHHHHHHHH...",
            "..HHHHHHHHHHHH..",
            ".HHHkkkkkkkkHHH.",
            "HHHHHHHHHHHHHHHH",
            "..ssssssssssss..",
            "..sseessseess...",
            "..ssssssssssss..",
            "..sssssnnsssss..",
            "..ssssssssssss..",
            "..ssmWWWWWWmss..",
            "...ssssssssss...",
            "....ssssssss....",
            "..rr.ssssss.rr..",
            ".rrrrrrbbrrrrrr.",
            "rrrrrrrqqrrrrrrr",
        ],
    },
    'Dr. Delgado': {
        palette: {
            Y: '#F2C230', y: '#D9A916', s: '#B5754A', e: '#241408',
            n: '#9A5F3A', M: '#3A2A1A', m: '#7A4530', k: '#B8A070',
        },
        rows: [
            "......YYYY......",
            "....YYYYYYYY....",
            "...YYYYYYYYYY...",
            ".yyYYYYYYYYYYyy.",
            "yyyyyyyyyyyyyyyy",
            "..ssssssssssss..",
            "..sseessseess...",
            "..ssssssssssss..",
            "..sssssnnsssss..",
            "..ssMMMMMMMMss..",
            "..ssssmmmmssss..",
            "...ssssssssss...",
            "....ssssssss....",
            "..kk.ssssss.kk..",
            ".kkkkkkkkkkkkkk.",
            "kkkkkkkkkkkkkkkk",
        ],
    },
    'UFO Watcher': {
        palette: {
            F: '#C0C8D0', f: '#98A2AC', s: '#E8C49C', e: '#241408',
            W: '#F8F4E8', n: '#C89A6E', m: '#7A4530', B: '#5C4433',
            j: '#2F4F4F',
        },
        rows: [
            ".......FF.......",
            "......FfFF......",
            ".....FFFfFF.....",
            "....FFFFFFFF....",
            "...FFFFFFFFFF...",
            "..ssssssssssss..",
            "..sWeesssWees...",
            "..ssssssssssss..",
            "..sssssnnsssss..",
            "..sBssssssssBs..",
            "..sBBsmmmmsBBs..",
            "...sBBBBBBBBs...",
            "....ssssssss....",
            "..jj.ssssss.jj..",
            ".jjjjjjjjjjjjjj.",
            "jjjjjjjjjjjjjjjj",
        ],
    },
    'Old Prospector': {
        palette: {
            H: '#5C4033', h: '#4A3226', s: '#D9A066', e: '#241408',
            n: '#B5754A', m: '#4A2A18', B: '#C0C0C0', r: '#8B6914',
        },
        rows: [
            "....HHHHHHHH....",
            "...HHHHHHHHHH...",
            "..HHHHHHHHHHHH..",
            "hHHHHHHHHHHHHHHh",
            "hhhhhhhhhhhhhhhh",
            "..ssssssssssss..",
            "..sseessseess...",
            "..ssssssssssss..",
            "..sBsssnnsssBs..",
            ".sBBBBBBBBBBBBs.",
            ".BBBBBBBBBBBBBB.",
            ".BBBBBmmmmBBBBB.",
            "..BBBBBBBBBBBB..",
            "..rrBBBBBBBBrr..",
            ".rrrrBBBBBBrrrr.",
            "rrrrrrBBBBrrrrrr",
        ],
    },
    'Ranger Rick': {
        palette: {
            R: '#6B4226', s: '#E8C49C', e: '#241408', n: '#C89A6E',
            m: '#7A4530', g: '#556B2F', G: '#DAA520',
        },
        rows: [
            "......RRRR......",
            "....RRRRRRRR....",
            "RRRRRRRRRRRRRRRR",
            "RRRRRRRRRRRRRRRR",
            "..ssssssssssss..",
            "..sseessseess...",
            "..ssssssssssss..",
            "..sssssnnsssss..",
            "..ssssssssssss..",
            "..sssmmmmmmsss..",
            "...ssssssssss...",
            "....ssssssss....",
            "..gg.ssssss.gg..",
            ".gggggggggggggg.",
            "gggggggGGggggggg",
            "gggggggggggggggg",
        ],
    },
    'Old Hermit': {
        palette: {
            g: '#A9A9A9', s: '#C9A47E', e: '#241408', n: '#A87A50',
            m: '#4A2A18', B: '#D0D0D0', j: '#607D8B',
        },
        rows: [
            "................",
            "..g..gggggg..g..",
            ".gggggggggggggg.",
            ".gggggggggggggg.",
            "..gssssssssssg..",
            "..gssssssssssg..",
            "..gseessseessg..",
            "..gssssssssssg..",
            "..gssssnnsssg...",
            "..gBssssssssBg..",
            ".gBBBBBBBBBBBBg.",
            ".BBBBBmmmmBBBBB.",
            ".BBBBBBBBBBBBBB.",
            "..BBBBBBBBBBBB..",
            "..jjBBBBBBBBjj..",
            ".jjjjjBBBBjjjjj.",
        ],
    },
    'Lock Keeper Vega': {
        palette: {
            c: '#2A5A8A', C: '#1E4266', s: '#B5754A', e: '#241408',
            n: '#9A5F3A', m: '#7A4530', b: '#4E6A8A',
        },
        rows: [
            "....cccccccc....",
            "...cccccccccc...",
            "..CCCCCCCCCCCC..",
            "..ssssssssssss..",
            "..sseessseess...",
            "..ssssssssssss..",
            "..sssssnnsssss..",
            "..ssssssssssss..",
            "..sssmmmmmmsss..",
            "...ssssssssss...",
            "....ssssssss....",
            "..bb.ssssss.bb..",
            ".bbbbbbbbbbbbbb.",
            "bbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbb",
        ],
    },
};

Object.assign(PORTRAITS, {
    'Tired Hiker': {
        palette: {
            k: '#5C4433', w: '#F0EAD8', s: '#E8C49C', e: '#241408',
            n: '#C89A6E', m: '#7A4530', r: '#FF6347', g: '#2E8B57',
        },
        rows: [
            "................",
            "....kkkkkkkk....",
            "...kkkkkkkkkk...",
            "..wwwwwwwwwwww..",
            "..ssssssssssss..",
            "..sseessseess...",
            "..ssssssssssss..",
            "..sssssnnsssss..",
            "..ssssssssssss..",
            "..sssmmmmmmsss..",
            "...ssssssssss...",
            "....ssssssss....",
            "..rr.ssssss.rr..",
            ".rgrrrrrrrrrrgr.",
            "rrgrrrrrrrrrrgrr",
            "rrgrrrrrrrrrrgrr",
        ],
    },
    Photographer: {
        palette: {
            c: '#B22222', s: '#E8C49C', e: '#241408', n: '#C89A6E',
            m: '#7A4530', g: '#8FBC8F', K: '#333333',
        },
        rows: [
            "................",
            "....cccccccc....",
            "..cccccccccccc..",
            "..cccccccccccc..",
            "..ssssssssssss..",
            "..sseessseess...",
            "..ssssssssssss..",
            "..sssssnnsssss..",
            "..ssssssssssss..",
            "..ssssmmmmssss..",
            "...ssssssssss...",
            "....ssssssss....",
            "..gg.ssssss.gg..",
            ".ggKggggggggggg.",
            "ggggKggggggggggg",
            "gggggKgggggggggg",
        ],
    },
    'Morning Fisherman': {
        palette: {
            b: '#9AA382', s: '#E8C49C', e: '#241408', n: '#C89A6E',
            m: '#7A4530', t: '#B0A090', j: '#7A8B9A',
        },
        rows: [
            "................",
            "....bbbbbbbb....",
            "...bbbbbbbbbb...",
            ".bbbbbbbbbbbbbb.",
            "..ssssssssssss..",
            "..sseessseess...",
            "..ssssssssssss..",
            "..sssssnnsssss..",
            "..stssssssssts..",
            "..sttmmmmmmtts..",
            "...tsssssssst...",
            "....ssssssss....",
            "..jj.ssssss.jj..",
            ".jjjjjjjjjjjjjj.",
            "jjjjjjjjjjjjjjjj",
            "jjjjjjjjjjjjjjjj",
        ],
    },
    'Ranger Alvarez': {
        palette: {
            R: '#6B4226', s: '#B5754A', e: '#241408', n: '#9A5F3A',
            M: '#3A2A1A', m: '#6E3A20', g: '#556B2F', G: '#DAA520',
        },
        rows: [
            "......RRRR......",
            "....RRRRRRRR....",
            "RRRRRRRRRRRRRRRR",
            "RRRRRRRRRRRRRRRR",
            "..ssssssssssss..",
            "..sseessseess...",
            "..ssssssssssss..",
            "..sssssnnsssss..",
            "..ssMMMMMMMMss..",
            "..ssssmmmmssss..",
            "...ssssssssss...",
            "....ssssssss....",
            "..gg.ssssss.gg..",
            ".gggggggggggggg.",
            "ggggggggGGgggggg",
            "gggggggggggggggg",
        ],
    },
    'Amateur Astronomer': {
        palette: {
            g: '#B8B8B8', s: '#E8C49C', K: '#2A2A2A', w: '#C8E8F8',
            e: '#241408', n: '#C89A6E', m: '#7A4530', N: '#34506E',
        },
        rows: [
            "................",
            "....ssssssss....",
            "..gsssssssssg...",
            "..gsssssssssg...",
            "..ssssssssssss..",
            "..KKKKsssKKKK...",
            "..KweKsssKweK...",
            "..ssssssssssss..",
            "..sssssnnsssss..",
            "..ssssssssssss..",
            "..sssmmmmmmsss..",
            "...ssssssssss...",
            "..NN.ssssss.NN..",
            ".NNNNNNNNNNNNNN.",
            "NNNNNNNNNNNNNNNN",
            "NNNNNNNNNNNNNNNN",
        ],
    },
    'Petroglyph Researcher': {
        palette: {
            k: '#4A3226', s: '#E8C49C', K: '#1A1A1A', n: '#C89A6E',
            m: '#7A4530', b: '#4682B4',
        },
        rows: [
            "................",
            "....kkkkkkkk....",
            "...kkkkkkkkkk...",
            "..kkkkkkkkkkkk..",
            "..ssssssssssss..",
            "..sKKKKKKKKKKs..",
            "..ssssssssssss..",
            "..sssssnnsssss..",
            "..ssssssssssss..",
            "..ssssmmmmssss..",
            "...ssssssssss...",
            "....ssssssss....",
            "..bb.ssssss.bb..",
            ".bbbbbbbbbbbbbb.",
            "bbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbb",
        ],
    },
    'Star Party Host': {
        palette: {
            d: '#2E2E3E', R: '#E23A2A', s: '#E8C49C', e: '#241408',
            n: '#C89A6E', m: '#7A4530', B: '#3A2A1A', h: '#3A3A4E',
        },
        rows: [
            "................",
            "....dddddddd....",
            "...dddddddddd...",
            "..ddddddRRdddd..",
            "..ssssssssssss..",
            "..sseessseess...",
            "..ssssssssssss..",
            "..sssssnnsssss..",
            "..ssssssssssss..",
            "..ssssmmmmssss..",
            "...sssBBBBsss...",
            "....ssBBBBss....",
            "..hh.ssssss.hh..",
            ".hhhhhhhhhhhhhh.",
            "hhhhhhhhhhhhhhhh",
            "hhhhhhhhhhhhhhhh",
        ],
    },
    'Grad Student': {
        palette: {
            k: '#2A1A14', s: '#E8C49C', e: '#241408', t: '#C8A080',
            n: '#C89A6E', m: '#7A4530', o: '#D2691E',
        },
        rows: [
            "......kkkk......",
            "....kkkkkkkk....",
            "...kkkkkkkkkk...",
            "..kkkkkkkkkkkk..",
            "..ssssssssssss..",
            "..sseessseess...",
            "..sttssssttss...",
            "..sssssnnsssss..",
            "..ssssssssssss..",
            "..ssssmmmmssss..",
            "...ssssssssss...",
            "....ssssssss....",
            "..oo.ssssss.oo..",
            ".oooooooooooooo.",
            "oooooooooooooooo",
            "oooooooooooooooo",
        ],
    },
    Sparky: {
        palette: {
            m: '#8C1D40', G: '#FFC627', W: '#F8F4E8',
        },
        rows: [
            "..G..........G..",
            "..GG........GG..",
            "...mmmmmmmmmm...",
            "..mmmmmmmmmmmm..",
            "..mmmmmmmmmmmm..",
            "..mmGGmmmmGGmm..",
            "..mmmmmmmmmmmm..",
            "..mmmmmmmmmmmm..",
            "..mWWWWWWWWWWm..",
            "..mmWWWWWWWWmm..",
            "...mmmmmmmmmm...",
            "....mmmmmm......",
            "..mm.mmmmmm.mm..",
            ".mmmmmmGGmmmmmm.",
            "mmmmmmGGmmmmmmmm",
            "mmmmmmmGGmmmmmmm",
        ],
    },
    'Tumbleweed Ted': {
        palette: {
            T: '#A0522D', d: '#6E3A1A', s: '#D9A066', e: '#241408',
            n: '#B5754A', m: '#6E3A20', t: '#8A6B4F',
            r: '#B23A48', y: '#E0A458', g: '#3E7C59',
        },
        rows: [
            "......TTTT......",
            ".....TTTTTT.....",
            ".....TTTTTT.....",
            "TTTTTTddddTTTTTT",
            "TTTTTTTTTTTTTTTT",
            "..ssssssssssss..",
            "..sseessseess...",
            "..sssssnnsssss..",
            "..stssssssssts..",
            "..sttmmmmmmtts..",
            "...ssssssssss...",
            "....ssssssss....",
            ".rrrrrrrrrrrrrr.",
            "yyyyyyyyyyyyyyyy",
            "gggggggggggggggg",
            "gggggggggggggggg",
        ],
    },
    'Wandering Musician': {
        palette: {
            b: '#CC2222', d: '#A01818', s: '#C9A47E', e: '#241408',
            n: '#A87A50', m: '#6E3A20', B: '#3A2A1A', p: '#6A0DAD',
        },
        rows: [
            "................",
            "....bbbbbbbb....",
            "..bbbbbbbbbbbb..",
            "..bbdbbbbbbdbb..",
            "..ssssssssssss..",
            "..sseessseess...",
            "..ssssssssssss..",
            "..sssssnnsssss..",
            "..ssssssssssss..",
            "..sssmmmmmmsss..",
            "...ssssBBssss...",
            "....ssssssss....",
            "..pp.ssssss.pp..",
            ".pppppppppppppp.",
            "pppppppppppppppp",
            "pppppppppppppppp",
        ],
    },
    'Lost Tourist': {
        palette: {
            H: '#F5DEB3', h: '#D8C090', s: '#E8A088', e: '#241408',
            W: '#F8F8F0', m: '#8A4A38', o: '#FF4500', K: '#333333',
        },
        rows: [
            "....HHHHHHHH....",
            "...HHHHHHHHHH...",
            "HHHHHHHHHHHHHHHH",
            "hhhhhhhhhhhhhhhh",
            "..ssssssssssss..",
            "..sseessseess...",
            "..ssssssssssss..",
            "..sssssWWsssss..",
            "..ssssssssssss..",
            "..sssmmmmmmsss..",
            "...ssssssssss...",
            "....ssssssss....",
            "..oo.ssssss.oo..",
            ".ooKooooooooooo.",
            "ooooKooooooooooo",
            "oooooKoooooooooo",
        ],
    },
    "Saloon Keeper's Ghost": {
        palette: {
            h: '#B0E0E6', g: '#ADD8E6', W: '#FFFFFF',
            M: '#8AB8C6', k: '#2A3A44',
        },
        rows: [
            "................",
            "....hhhhhhhh....",
            "...hhhhhhhhhh...",
            "..hhhhhhhhhhhh..",
            "..gggggggggggg..",
            "..gWWggggggWWg..",
            "..gggggggggggg..",
            "..gggggggggggg..",
            "..gMMMMMMMMMMg..",
            "..MMggggggggMM..",
            "...gggggggggg...",
            "....gggggggg....",
            "..gg.gkkkkg.gg..",
            ".ggggggkkgggggg.",
            "gggggggggggggggg",
            "gggggggggggggggg",
        ],
    },
    "Miner's Ghost": {
        palette: {
            h: '#7AA8B8', G: '#FFE066', g: '#ADD8E6',
            W: '#FFFFFF', B: '#C8E4EE',
        },
        rows: [
            "................",
            "....hhhhhhhh....",
            "...hhhGGhhhhh...",
            "..hhhhGGhhhhhh..",
            ".hhhhhhhhhhhhhh.",
            "..gggggggggggg..",
            "..gWWggggggWWg..",
            "..gggggggggggg..",
            "..gggggggggggg..",
            "..gBBBBBBBBBBg..",
            "...gBBBBBBBBg...",
            "....gggggggg....",
            "..gg.gggggg.gg..",
            ".gggggggggggggg.",
            "gggggggggggggggg",
            "gggggggggggggggg",
        ],
    },
});

// Exposed for validation in tests
export const PORTRAIT_DATA = PORTRAITS;

// Which portrait (if any) a dialog speaker maps to: characters only
export function resolvePortraitKey(name) {
    return (name && Object.prototype.hasOwnProperty.call(PORTRAITS, name)) ? name : null;
}

const cache = {};

export function getPortraitURL(speakerName) {
    const name = resolvePortraitKey(speakerName);
    if (!name) return null;
    if (name in cache) return cache[name];
    let url = null;
    try {
        const { palette, rows } = PORTRAITS[name];
        const scale = 4;
        const canvas = document.createElement('canvas');
        canvas.width = rows[0].length * scale;
        canvas.height = rows.length * scale;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1A1410';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        rows.forEach((row, r) => {
            for (let c = 0; c < row.length; c++) {
                const color = palette[row[c]];
                if (!color) continue;
                ctx.fillStyle = color;
                ctx.fillRect(c * scale, r * scale, scale, scale);
            }
        });
        url = canvas.toDataURL();
    } catch (e) {
        url = null; // non-browser or canvas-less environment: text-only dialog
    }
    cache[name] = url;
    return url;
}
