(function(app) {


    // https://static.1qianbao.com/static/pinganfuweb-modules/pafweblib/pwdGrd/1.0.1/encryptor-debug.js
    // 加密函数压缩
    function hex2int8array(Os1) {
        var zoAbYGhvL2 = "0123456789abcdef";
        var yswGz3 = [Os1["length"] / 2];
        var fqhNCq4 = new window["Array"]();
        for (i = 0; i < yswGz3; i++) {
            fqhNCq4[i] = zoAbYGhvL2["indexOf"](Os1["charAt"](i * 2 + 0)) * 16 + zoAbYGhvL2["indexOf"](Os1["charAt"](i * 2 + 1));
        }
        return fqhNCq4;
    };

    function int8array2hex(P5) {
        var SZnSBGORl6 = "0123456789abcdef";
        var JjujsKHif7 = "";
        for (i = 0; i < P5["length"]; i++) {
            var oYOBiJ8 = P5[i] % 16;
            var $eivcif9 = P5[i] - P5[i] % 16;
            $eivcif9 = $eivcif9 / 16;
            JjujsKHif7 += SZnSBGORl6["substring"]($eivcif9, $eivcif9 + 1) + "" + SZnSBGORl6["substring"](oYOBiJ8, oYOBiJ8 + 1);
        }
        return JjujsKHif7;
    };

    function rc4() {}
    rc4["prototype"]["rc4crypt"] = function(skey, DyrWZSt10) {
        key = hex2int8array(skey);
        pt = hex2int8array(DyrWZSt10);
        s = new window["Array"]();
        for (var nBMHVDWBH11 = 0; nBMHVDWBH11 < 256; nBMHVDWBH11++) {
            s[nBMHVDWBH11] = nBMHVDWBH11;
        }
        var c12 = 0;
        var G13;
        for (nBMHVDWBH11 = 0; nBMHVDWBH11 < 256; nBMHVDWBH11++) {
            c12 = (c12 + s[nBMHVDWBH11] + key[nBMHVDWBH11 % key["length"]]) % 256;
            G13 = s[nBMHVDWBH11];
            s[nBMHVDWBH11] = s[c12];
            s[c12] = G13;
        }
        nBMHVDWBH11 = 0;
        c12 = 0;
        ct = new window["Array"]();
        for (var CQsZn14 = 0; CQsZn14 < pt["length"]; CQsZn14++) {
            nBMHVDWBH11 = (nBMHVDWBH11 + 1) % 256;
            c12 = (c12 + s[nBMHVDWBH11]) % 256;
            G13 = s[nBMHVDWBH11];
            s[nBMHVDWBH11] = s[c12];
            s[c12] = G13;
            ct[CQsZn14] = pt[CQsZn14] ^ s[(s[nBMHVDWBH11] + s[c12]) % 256];
        }
        return int8array2hex(ct);
    };
    rc4["prototype"]["init"] = function(skey) {
        key = hex2int8array(skey);
        s = new window["Array"]();
        for (var N15 = 0; N15 < 256; N15++) {
            s[N15] = N15;
        }
        var LJpzFKb16 = 0;
        var hg17;
        for (N15 = 0; N15 < 256; N15++) {
            LJpzFKb16 = (LJpzFKb16 + s[N15] + key[N15 % key["length"]]) % 256;
            hg17 = s[N15];
            s[N15] = s[LJpzFKb16];
            s[LJpzFKb16] = hg17;
        }
        this["i"] = 0;
        this["j"] = 0;
        this["s"] = s;
    };
    rc4["prototype"]["crypt"] = function(spt) {
        pt = hex2int8array(spt);
        s = this["s"];
        i = this["i"];
        j = this["j"];
        ct = new window["Array"]();
        for (var wOGSpaQ18 = 0; wOGSpaQ18 < pt["length"]; wOGSpaQ18++) {
            i = (i + 1) % 256;
            j = (j + s[i]) % 256;
            x = s[i];
            s[i] = s[j];
            s[j] = x;
            ct[wOGSpaQ18] = pt[wOGSpaQ18] ^ s[(s[i] + s[j]) % 256];
        }
        this["s"] = s;
        this["i"] = i;
        this["j"] = j;
        return int8array2hex(ct);
    };
    var AsUDZpPM1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var hwR2 = "=";

    function hex2b64(VaKtDYI3) {
        var j4;
        var MIgFBkw5;
        var HJ6 = "";
        for (j4 = 0; j4 + 3 <= VaKtDYI3["length"]; j4 += 3) {
            MIgFBkw5 = window["parseInt"](VaKtDYI3["substring"](j4, j4 + 3), 16);
            HJ6 += AsUDZpPM1["charAt"](MIgFBkw5 >> 6) + AsUDZpPM1["charAt"](MIgFBkw5 & 63);
        }
        if (j4 + 1 == VaKtDYI3["length"]) {
            MIgFBkw5 = window["parseInt"](VaKtDYI3["substring"](j4, j4 + 1), 16);
            HJ6 += AsUDZpPM1["charAt"](MIgFBkw5 << 2);
        } else if (j4 + 2 == VaKtDYI3["length"]) {
            MIgFBkw5 = window["parseInt"](VaKtDYI3["substring"](j4, j4 + 2), 16);
            HJ6 += AsUDZpPM1["charAt"](MIgFBkw5 >> 2) + AsUDZpPM1["charAt"]((MIgFBkw5 & 3) << 4);
        }
        while ((HJ6["length"] & 3) > 0) HJ6 += hwR2;
        return HJ6;
    };

    function b64tohex(mNqvsSZgU7) {
        var rmTRUlu8 = "";
        var VZCL_kjE9;
        var AsOWTEK10 = 0;
        var r11;
        for (VZCL_kjE9 = 0; VZCL_kjE9 < mNqvsSZgU7["length"]; ++VZCL_kjE9) {
            if (mNqvsSZgU7["charAt"](VZCL_kjE9) == hwR2) break;
            v = AsUDZpPM1["indexOf"](mNqvsSZgU7["charAt"](VZCL_kjE9));
            if (v < 0) continue;
            if (AsOWTEK10 == 0) {
                rmTRUlu8 += int2char(v >> 2);
                r11 = v & 3;
                AsOWTEK10 = 1;
            } else if (AsOWTEK10 == 1) {
                rmTRUlu8 += int2char(r11 << 2 | v >> 4);
                r11 = v & 15;
                AsOWTEK10 = 2;
            } else if (AsOWTEK10 == 2) {
                rmTRUlu8 += int2char(r11);
                rmTRUlu8 += int2char(v >> 2);
                r11 = v & 3;
                AsOWTEK10 = 3;
            } else {
                rmTRUlu8 += int2char(r11 << 2 | v >> 4);
                rmTRUlu8 += int2char(v & 15);
                AsOWTEK10 = 0;
            }
        }
        if (AsOWTEK10 == 1) rmTRUlu8 += int2char(r11 << 2);
        return rmTRUlu8;
    };

    function b64toBA(f12) {
        var WL13 = b64tohex(f12);
        var JEsaJ14;
        var CuviGJs15 = new window["Array"]();
        for (JEsaJ14 = 0; 2 * JEsaJ14 < WL13["length"]; ++JEsaJ14) {
            CuviGJs15[JEsaJ14] = window["parseInt"](WL13["substring"](2 * JEsaJ14, 2 * JEsaJ14 + 2), 16);
        }
        return CuviGJs15;
    };
    var dbits;
    var canary = 0xdeadbeefcafe;
    var j_lm = (canary & 16777215) == 15715070;

    function BigInteger(a, b, c) {
        if (a != null)
            if ("number" == typeof a) this.fromNumber(a, b, c);
            else if (b == null && "string" != typeof a) this.fromString(a, 256);
        else this.fromString(a, b);
    }

    function nbi() {
        return new BigInteger(null);
    }

    function am1(i, x, w, j, c, n) {
        while (--n >= 0) {
            var v = x * this[i++] + w[j] + c;
            c = Math.floor(v / 67108864);
            w[j++] = v & 67108863;
        }
        return c;
    }

    function am2(i, x, w, j, c, n) {
        var xl = x & 32767,
            xh = x >> 15;
        while (--n >= 0) {
            var l = this[i] & 32767;
            var h = this[i++] >> 15;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 32767) << 15) + w[j] + (c & 1073741823);
            c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
            w[j++] = l & 1073741823;
        }
        return c;
    }

    function am3(i, x, w, j, c, n) {
        var xl = x & 16383,
            xh = x >> 14;
        while (--n >= 0) {
            var l = this[i] & 16383;
            var h = this[i++] >> 14;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 16383) << 14) + w[j] + c;
            c = (l >> 28) + (m >> 14) + xh * h;
            w[j++] = l & 268435455;
        }
        return c;
    }
    if (j_lm && navigator.appName == "Microsoft Internet Explorer") {
        BigInteger.prototype.am = am2;
        dbits = 30;
    } else if (j_lm && navigator.appName != "Netscape") {
        BigInteger.prototype.am = am1;
        dbits = 26;
    } else {
        BigInteger.prototype.am = am3;
        dbits = 28;
    }
    BigInteger.prototype.DB = dbits;
    BigInteger.prototype.DM = (1 << dbits) - 1;
    BigInteger.prototype.DV = 1 << dbits;
    var BI_FP = 52;
    BigInteger.prototype.FV = Math.pow(2, BI_FP);
    BigInteger.prototype.F1 = BI_FP - dbits;
    BigInteger.prototype.F2 = 2 * dbits - BI_FP;
    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
    var BI_RC = new Array();
    var rr, vv;
    rr = "0".charCodeAt(0);
    for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
    rr = "a".charCodeAt(0);
    for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
    rr = "A".charCodeAt(0);
    for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

    function int2char(n) {
        return BI_RM.charAt(n);
    }

    function intAt(s, i) {
        var c = BI_RC[s.charCodeAt(i)];
        return c == null ? -1 : c;
    }

    function bnpCopyTo(r) {
        for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];
        r.t = this.t;
        r.s = this.s;
    }

    function bnpFromInt(x) {
        this.t = 1;
        this.s = x < 0 ? -1 : 0;
        if (x > 0) this[0] = x;
        else if (x < -1) this[0] = x + DV;
        else this.t = 0;
    }

    function nbv(i) {
        var r = nbi();
        r.fromInt(i);
        return r;
    }

    function bnpFromString(s, b) {
        var k;
        if (b == 16) k = 4;
        else if (b == 8) k = 3;
        else if (b == 256) k = 8;
        else if (b == 2) k = 1;
        else if (b == 32) k = 5;
        else if (b == 4) k = 2;
        else {
            this.fromRadix(s, b);
            return;
        }
        this.t = 0;
        this.s = 0;
        var i = s.length,
            mi = false,
            sh = 0;
        while (--i >= 0) {
            var x = k == 8 ? s[i] & 255 : intAt(s, i);
            if (x < 0) {
                if (s.charAt(i) == "-") mi = true;
                continue;
            }
            mi = false;
            if (sh == 0) this[this.t++] = x;
            else if (sh + k > this.DB) {
                this[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
                this[this.t++] = x >> this.DB - sh;
            } else this[this.t - 1] |= x << sh;
            sh += k;
            if (sh >= this.DB) sh -= this.DB;
        }
        if (k == 8 && (s[0] & 128) != 0) {
            this.s = -1;
            if (sh > 0) this[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
        }
        this.clamp();
        if (mi) BigInteger.ZERO.subTo(this, this);
    }

    function bnpClamp() {
        var c = this.s & this.DM;
        while (this.t > 0 && this[this.t - 1] == c) --this.t;
    }

    function bnToString(b) {
        if (this.s < 0) return "-" + this.negate().toString(b);
        var k;
        if (b == 16) k = 4;
        else if (b == 8) k = 3;
        else if (b == 2) k = 1;
        else if (b == 32) k = 5;
        else if (b == 4) k = 2;
        else return this.toRadix(b);
        var km = (1 << k) - 1,
            d, m = false,
            r = "",
            i = this.t;
        var p = this.DB - i * this.DB % k;
        if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) > 0) {
                m = true;
                r = int2char(d);
            }
            while (i >= 0) {
                if (p < k) {
                    d = (this[i] & (1 << p) - 1) << k - p;
                    d |= this[--i] >> (p += this.DB - k);
                } else {
                    d = this[i] >> (p -= k) & km;
                    if (p <= 0) {
                        p += this.DB;
                        --i;
                    }
                }
                if (d > 0) m = true;
                if (m) r += int2char(d);
            }
        }
        return m ? r : "0";
    }

    function bnNegate() {
        var r = nbi();
        BigInteger.ZERO.subTo(this, r);
        return r;
    }

    function bnAbs() {
        return this.s < 0 ? this.negate() : this;
    }

    function bnCompareTo(a) {
        var r = this.s - a.s;
        if (r != 0) return r;
        var i = this.t;
        r = i - a.t;
        if (r != 0) return r;
        while (--i >= 0)
            if ((r = this[i] - a[i]) != 0) return r;
        return 0;
    }

    function nbits(x) {
        var r = 1,
            t;
        if ((t = x >>> 16) != 0) {
            x = t;
            r += 16;
        }
        if ((t = x >> 8) != 0) {
            x = t;
            r += 8;
        }
        if ((t = x >> 4) != 0) {
            x = t;
            r += 4;
        }
        if ((t = x >> 2) != 0) {
            x = t;
            r += 2;
        }
        if ((t = x >> 1) != 0) {
            x = t;
            r += 1;
        }
        return r;
    }

    function bnBitLength() {
        if (this.t <= 0) return 0;
        return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
    }

    function bnpDLShiftTo(n, r) {
        var i;
        for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
        for (i = n - 1; i >= 0; --i) r[i] = 0;
        r.t = this.t + n;
        r.s = this.s;
    }

    function bnpDRShiftTo(n, r) {
        for (var i = n; i < this.t; ++i) r[i - n] = this[i];
        r.t = Math.max(this.t - n, 0);
        r.s = this.s;
    }

    function bnpLShiftTo(n, r) {
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << cbs) - 1;
        var ds = Math.floor(n / this.DB),
            c = this.s << bs & this.DM,
            i;
        for (i = this.t - 1; i >= 0; --i) {
            r[i + ds + 1] = this[i] >> cbs | c;
            c = (this[i] & bm) << bs;
        }
        for (i = ds - 1; i >= 0; --i) r[i] = 0;
        r[ds] = c;
        r.t = this.t + ds + 1;
        r.s = this.s;
        r.clamp();
    }

    function bnpRShiftTo(n, r) {
        r.s = this.s;
        var ds = Math.floor(n / this.DB);
        if (ds >= this.t) {
            r.t = 0;
            return;
        }
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << bs) - 1;
        r[0] = this[ds] >> bs;
        for (var i = ds + 1; i < this.t; ++i) {
            r[i - ds - 1] |= (this[i] & bm) << cbs;
            r[i - ds] = this[i] >> bs;
        }
        if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
        r.t = this.t - ds;
        r.clamp();
    }

    function bnpSubTo(a, r) {
        var i = 0,
            c = 0,
            m = Math.min(a.t, this.t);
        while (i < m) {
            c += this[i] - a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        if (a.t < this.t) {
            c -= a.s;
            while (i < this.t) {
                c += this[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += this.s;
        } else {
            c += this.s;
            while (i < a.t) {
                c -= a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c -= a.s;
        }
        r.s = c < 0 ? -1 : 0;
        if (c < -1) r[i++] = this.DV + c;
        else if (c > 0) r[i++] = c;
        r.t = i;
        r.clamp();
    }

    function bnpMultiplyTo(a, r) {
        var x = this.abs(),
            y = a.abs();
        var i = x.t;
        r.t = i + y.t;
        while (--i >= 0) r[i] = 0;
        for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
        r.s = 0;
        r.clamp();
        if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
    }

    function bnpSquareTo(r) {
        var x = this.abs();
        var i = r.t = 2 * x.t;
        while (--i >= 0) r[i] = 0;
        for (i = 0; i < x.t - 1; ++i) {
            var c = x.am(i, x[i], r, 2 * i, 0, 1);
            if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
                r[i + x.t] -= x.DV;
                r[i + x.t + 1] = 1;
            }
        }
        if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
        r.s = 0;
        r.clamp();
    }

    function bnpDivRemTo(m, q, r) {
        var pm = m.abs();
        if (pm.t <= 0) return;
        var pt = this.abs();
        if (pt.t < pm.t) {
            if (q != null) q.fromInt(0);
            if (r != null) this.copyTo(r);
            return;
        }
        if (r == null) r = nbi();
        var y = nbi(),
            ts = this.s,
            ms = m.s;
        var nsh = this.DB - nbits(pm[pm.t - 1]);
        if (nsh > 0) {
            pm.lShiftTo(nsh, y);
            pt.lShiftTo(nsh, r);
        } else {
            pm.copyTo(y);
            pt.copyTo(r);
        }
        var ys = y.t;
        var y0 = y[ys - 1];
        if (y0 == 0) return;
        var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
        var d1 = this.FV / yt,
            d2 = (1 << this.F1) / yt,
            e = 1 << this.F2;
        var i = r.t,
            j = i - ys,
            t = q == null ? nbi() : q;
        y.dlShiftTo(j, t);
        if (r.compareTo(t) >= 0) {
            r[r.t++] = 1;
            r.subTo(t, r);
        }
        BigInteger.ONE.dlShiftTo(ys, t);
        t.subTo(y, y);
        while (y.t < ys) y[y.t++] = 0;
        while (--j >= 0) {
            var qd = r[--i] == y0 ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
            if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
                y.dlShiftTo(j, t);
                r.subTo(t, r);
                while (r[i] < --qd) r.subTo(t, r);
            }
        }
        if (q != null) {
            r.drShiftTo(ys, q);
            if (ts != ms) BigInteger.ZERO.subTo(q, q);
        }
        r.t = ys;
        r.clamp();
        if (nsh > 0) r.rShiftTo(nsh, r);
        if (ts < 0) BigInteger.ZERO.subTo(r, r);
    }

    function bnMod(a) {
        var r = nbi();
        this.abs().divRemTo(a, null, r);
        if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
        return r;
    }

    function Classic(m) {
        this.m = m;
    }

    function cConvert(x) {
        if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
        else return x;
    }

    function cRevert(x) {
        return x;
    }

    function cReduce(x) {
        x.divRemTo(this.m, null, x);
    }

    function cMulTo(x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    }

    function cSqrTo(x, r) {
        x.squareTo(r);
        this.reduce(r);
    }
    Classic.prototype.convert = cConvert;
    Classic.prototype.revert = cRevert;
    Classic.prototype.reduce = cReduce;
    Classic.prototype.mulTo = cMulTo;
    Classic.prototype.sqrTo = cSqrTo;

    function bnpInvDigit() {
        if (this.t < 1) return 0;
        var x = this[0];
        if ((x & 1) == 0) return 0;
        var y = x & 3;
        y = y * (2 - (x & 15) * y) & 15;
        y = y * (2 - (x & 255) * y) & 255;
        y = y * (2 - ((x & 65535) * y & 65535)) & 65535;
        y = y * (2 - x * y % this.DV) % this.DV;
        return y > 0 ? this.DV - y : -y;
    }

    function Montgomery(m) {
        this.m = m;
        this.mp = m.invDigit();
        this.mpl = this.mp & 32767;
        this.mph = this.mp >> 15;
        this.um = (1 << m.DB - 15) - 1;
        this.mt2 = 2 * m.t;
    }

    function montConvert(x) {
        var r = nbi();
        x.abs().dlShiftTo(this.m.t, r);
        r.divRemTo(this.m, null, r);
        if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
        return r;
    }

    function montRevert(x) {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
    }

    function montReduce(x) {
        while (x.t <= this.mt2) x[x.t++] = 0;
        for (var i = 0; i < this.m.t; ++i) {
            var j = x[i] & 32767;
            var u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
            j = i + this.m.t;
            x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
            while (x[j] >= x.DV) {
                x[j] -= x.DV;
                x[++j] ++;
            }
        }
        x.clamp();
        x.drShiftTo(this.m.t, x);
        if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
    }

    function montSqrTo(x, r) {
        x.squareTo(r);
        this.reduce(r);
    }

    function montMulTo(x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    }
    Montgomery.prototype.convert = montConvert;
    Montgomery.prototype.revert = montRevert;
    Montgomery.prototype.reduce = montReduce;
    Montgomery.prototype.mulTo = montMulTo;
    Montgomery.prototype.sqrTo = montSqrTo;

    function bnpIsEven() {
        return (this.t > 0 ? this[0] & 1 : this.s) == 0;
    }

    function bnpExp(e, z) {
        if (e > 4294967295 || e < 1) return BigInteger.ONE;
        var r = nbi(),
            r2 = nbi(),
            g = z.convert(this),
            i = nbits(e) - 1;
        g.copyTo(r);
        while (--i >= 0) {
            z.sqrTo(r, r2);
            if ((e & 1 << i) > 0) z.mulTo(r2, g, r);
            else {
                var t = r;
                r = r2;
                r2 = t;
            }
        }
        return z.revert(r);
    }

    function bnModPowInt(e, m) {
        var z;
        if (e < 256 || m.isEven()) z = new Classic(m);
        else z = new Montgomery(m);
        return this.exp(e, z);
    }
    BigInteger.prototype.copyTo = bnpCopyTo;
    BigInteger.prototype.fromInt = bnpFromInt;
    BigInteger.prototype.fromString = bnpFromString;
    BigInteger.prototype.clamp = bnpClamp;
    BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    BigInteger.prototype.lShiftTo = bnpLShiftTo;
    BigInteger.prototype.rShiftTo = bnpRShiftTo;
    BigInteger.prototype.subTo = bnpSubTo;
    BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    BigInteger.prototype.squareTo = bnpSquareTo;
    BigInteger.prototype.divRemTo = bnpDivRemTo;
    BigInteger.prototype.invDigit = bnpInvDigit;
    BigInteger.prototype.isEven = bnpIsEven;
    BigInteger.prototype.exp = bnpExp;
    BigInteger.prototype.toString = bnToString;
    BigInteger.prototype.negate = bnNegate;
    BigInteger.prototype.abs = bnAbs;
    BigInteger.prototype.compareTo = bnCompareTo;
    BigInteger.prototype.bitLength = bnBitLength;
    BigInteger.prototype.mod = bnMod;
    BigInteger.prototype.modPowInt = bnModPowInt;
    BigInteger.ZERO = nbv(0);
    BigInteger.ONE = nbv(1);

    function Arcfour() {
        this["i"] = 0;
        this["j"] = 0;
        this["S"] = new window["Array"]();
    }

    function ARC4init(oDo$k_On1) {
        var Mlky2, GvVyFu3, kSjL4;
        for (Mlky2 = 0; Mlky2 < 256; ++Mlky2) this["S"][Mlky2] = Mlky2;
        GvVyFu3 = 0;
        for (Mlky2 = 0; Mlky2 < 256; ++Mlky2) {
            GvVyFu3 = GvVyFu3 + this["S"][Mlky2] + oDo$k_On1[Mlky2 % oDo$k_On1["length"]] & 255;
            kSjL4 = this["S"][Mlky2];
            this["S"][Mlky2] = this["S"][GvVyFu3];
            this["S"][GvVyFu3] = kSjL4;
        }
        this["i"] = 0;
        this["j"] = 0;
    }

    function ARC4next() {
        var W_Ag_5;
        this["i"] = this["i"] + 1 & 255;
        this["j"] = this["j"] + this["S"][this["i"]] & 255;
        W_Ag_5 = this["S"][this["i"]];
        this["S"][this["i"]] = this["S"][this["j"]];
        this["S"][this["j"]] = W_Ag_5;
        return this["S"][W_Ag_5 + this["S"][this["i"]] & 255];
    }
    Arcfour["prototype"]["init"] = ARC4init;
    Arcfour["prototype"]["next"] = ARC4next;

    function prng_newstate() {
        return new Arcfour();
    }
    var DUbmKf6 = 256;
    var cHzO7;
    var Ph8;
    var atVbSn9;

    function rng_seed_int(kzMO_M10) {
        Ph8[atVbSn9++] ^= kzMO_M10 & 255;
        Ph8[atVbSn9++] ^= kzMO_M10 >> 8 & 255;
        Ph8[atVbSn9++] ^= kzMO_M10 >> 16 & 255;
        Ph8[atVbSn9++] ^= kzMO_M10 >> 24 & 255;
        if (atVbSn9 >= DUbmKf6) atVbSn9 -= DUbmKf6;
    }

    function rng_seed_time() {
        rng_seed_int(new window["Date"]()["getTime"]());
    }
    if (Ph8 == null) {
        Ph8 = new window["Array"]();
        atVbSn9 = 0;
        var G11;
        if (navigator["appName"] == "Netscape" && navigator["appVersion"] < "5" && window["crypto"]) {
            var RE12 = window["crypto"]["random"](32);
            for (G11 = 0; G11 < RE12["length"]; ++G11) Ph8[atVbSn9++] = RE12["charCodeAt"](G11) & 255;
        }
        while (atVbSn9 < DUbmKf6) {
            G11 = window["Math"]["floor"](65536 * window["Math"]["random"]());
            Ph8[atVbSn9++] = G11 >>> 8;
            Ph8[atVbSn9++] = G11 & 255;
        }
        atVbSn9 = 0;
        rng_seed_time();
    }

    function rng_get_byte() {
        if (cHzO7 == null) {
            rng_seed_time();
            cHzO7 = prng_newstate();
            cHzO7["init"](Ph8);
            for (atVbSn9 = 0; atVbSn9 < Ph8["length"]; ++atVbSn9) Ph8[atVbSn9] = 0;
            atVbSn9 = 0;
        }
        return cHzO7["next"]();
    }

    function rng_get_bytes(KNA13) {
        var Xqv14;
        for (Xqv14 = 0; Xqv14 < KNA13["length"]; ++Xqv14) KNA13[Xqv14] = rng_get_byte();
    }

    function SecureRandom() {}
    SecureRandom["prototype"]["nextBytes"] = rng_get_bytes;

    function parseBigInt(C$eRYSX1, ClifR2) {
        return new BigInteger(C$eRYSX1, ClifR2);
    }

    function linebrk(sQU3, wttK4) {
        var iRbA5 = "";
        var az_uWW6 = 0;
        while (az_uWW6 + wttK4 < sQU3["length"]) {
            iRbA5 += sQU3["substring"](az_uWW6, az_uWW6 + wttK4) + "\n";
            az_uWW6 += wttK4;
        }
        return iRbA5 + sQU3["substring"](az_uWW6, sQU3["length"]);
    }

    function byte2Hex(MNDMTFNWw7) {
        if (MNDMTFNWw7 < 16) return "0" + MNDMTFNWw7["toString"](16);
        else return MNDMTFNWw7["toString"](16);
    }

    function pkcs1pad2(k8, VSMs9) {
        if (VSMs9 < k8["length"] + 11) {
            window["alert"]("Message too long for RSA");
            return null;
        }
        var hebGofbtJ10 = new window["Array"]();
        var t11 = k8["length"] - 1;
        while (t11 >= 0 && VSMs9 > 0) {
            var Lss12 = k8["charCodeAt"](t11--);
            if (Lss12 < 128) {
                hebGofbtJ10[--VSMs9] = Lss12;
            } else if (Lss12 > 127 && Lss12 < 2048) {
                hebGofbtJ10[--VSMs9] = Lss12 & 63 | 128;
                hebGofbtJ10[--VSMs9] = Lss12 >> 6 | 192;
            } else {
                hebGofbtJ10[--VSMs9] = Lss12 & 63 | 128;
                hebGofbtJ10[--VSMs9] = Lss12 >> 6 & 63 | 128;
                hebGofbtJ10[--VSMs9] = Lss12 >> 12 | 224;
            }
        }
        hebGofbtJ10[--VSMs9] = 0;
        var uHp13 = new SecureRandom();
        var $s14 = new window["Array"]();
        while (VSMs9 > 2) {
            $s14[0] = 0;
            while ($s14[0] == 0) uHp13["nextBytes"]($s14);
            hebGofbtJ10[--VSMs9] = $s14[0];
        }
        hebGofbtJ10[--VSMs9] = 2;
        hebGofbtJ10[--VSMs9] = 0;
        var $zSl15 = new BigInteger(hebGofbtJ10);
        return $zSl15;
    }

    function RSAKey() {
        this["n"] = null;
        this["e"] = 0;
        this["d"] = null;
        this["p"] = null;
        this["q"] = null;
        this["dmp1"] = null;
        this["dmq1"] = null;
        this["coeff"] = null;
    }

    function RSASetPublic(jozJa16, yNYrzbQ17) {
        if (jozJa16 != null && yNYrzbQ17 != null && jozJa16["length"] > 0 && yNYrzbQ17["length"] > 0) {
            this["n"] = parseBigInt(jozJa16, 16);
            this["e"] = window["parseInt"](yNYrzbQ17, 16);
        } else window["alert"]("Invalid RSA public key");
    }

    function RSADoPublic(ZI18) {
        return ZI18["modPowInt"](this["e"], this["n"]);
    }

    function RSAEncrypt(lo19) {
        var AzUf$ZYv20 = pkcs1pad2(lo19, this["n"]["bitLength"]() + 7 >> 3);
        if (AzUf$ZYv20 == null) return null;
        var AZFak21 = this["doPublic"](AzUf$ZYv20);
        if (AZFak21 == null) return null;
        var AGhEbYyE22 = AZFak21["toString"](16);
        var TXm23 = AGhEbYyE22;
        if ((AGhEbYyE22["length"] & 1) != 0) TXm23 = "0" + TXm23;
        return TXm23;
    }
    RSAKey["prototype"]["doPublic"] = RSADoPublic;
    RSAKey["prototype"]["setPublic"] = RSASetPublic;
    RSAKey["prototype"]["encrypt"] = RSAEncrypt;

    function str2hex(QqaAsD1) {
        var iZIm2 = "0123456789abcdef";
        var D3 = "";
        for (i = 0; i < QqaAsD1["length"]; i++) {
            var bR_vmVWZ4 = QqaAsD1["charCodeAt"](i);
            var s$TLUH5 = bR_vmVWZ4 % 16;
            var qXfsmm_6 = bR_vmVWZ4 - s$TLUH5;
            qXfsmm_6 = qXfsmm_6 / 16;
            D3 += iZIm2["substring"](qXfsmm_6, qXfsmm_6 + 1) + "" + iZIm2["substring"](s$TLUH5, s$TLUH5 + 1);
        }
        return D3;
    }

    function hex2str(XJzsQZ7) {
        var ezmE8 = "";
        var hVKDssBA9 = "0123456789abcdef";
        var hlPV$Xc10 = [XJzsQZ7["length"] / 2];
        for (i = 0; i < hlPV$Xc10; i++) {
            _char = hVKDssBA9["indexOf"](XJzsQZ7["charAt"](i * 2 + 0)) * 16 + hVKDssBA9["indexOf"](XJzsQZ7["charAt"](i * 2 + 1));
            ezmE8 += window["String"]["fromCharCode"](_char);
        }
        return ezmE8;
    }

    function hex_rand(UaiV1) {
        var DPlBs2 = new SecureRandom();
        var s$myJnIJs3 = new window["Array"]();
        for (var ZA4 = 0; ZA4 < UaiV1 + 1; ZA4++) s$myJnIJs3[ZA4] = 0;
        DPlBs2["nextBytes"](s$myJnIJs3);
        s$myJnIJs3[0] = 0;
        var TGIcZv5 = new BigInteger(s$myJnIJs3)["toString"](16);
        while (TGIcZv5["length"] < 16) TGIcZv5 = "0" + TGIcZv5;
        while (TGIcZv5["length"] < UaiV1 * 2) TGIcZv5 = "0" + TGIcZv5;
        return TGIcZv5;
    }

    function cryptk(pwd, ts, pk1, pk2) {
        var hQOCddg1 = pwd;
        var u$ssEDv2 = ts;
        var jfBH3 = pk1;
        var rMgt4 = pk2;
        var pA$jNr5 = "",
            jCf6 = "";
        var mESkLcJ7 = "",
            I8 = 0,
            shuGwr9 = 0;
        mESkLcJ7 = jfBH3;
        I8 = mESkLcJ7["indexOf"]("30818902818100");
        shuGwr9 = mESkLcJ7["lastIndexOf"]("0203010001");
        if (shuGwr9 > 0) {
            mESkLcJ7 = mESkLcJ7["substring"](0, shuGwr9);
            if (I8 == 0) {
                pA$jNr5 = mESkLcJ7["substring"](13);
            }
        }
        mESkLcJ7 = rMgt4;
        I8 = mESkLcJ7["indexOf"]("30818902818100");
        shuGwr9 = mESkLcJ7["lastIndexOf"]("0203010001");
        if (shuGwr9 > 0) {
            mESkLcJ7 = mESkLcJ7["substring"](0, shuGwr9);
            if (I8 == 0) {
                jCf6 = mESkLcJ7["substring"](13);
            }
        }
        var S10 = new RSAKey();
        S10["setPublic"](pA$jNr5, "010001");
        EK1 = S10["encrypt"](hQOCddg1);
        var s$dEDpQKP11 = "" + u$ssEDv2 + ":" + EK1;
        var a12 = str2hex(s$dEDpQKP11);
        var $EnALkOC13 = new SecureRandom();
        var dqo14 = new window["Array"]();
        for (var I8 = 0; I8 < 9; I8++) dqo14[I8] = 0;
        $EnALkOC13["nextBytes"](dqo14);
        dqo14[0] = 0;
        var QIOY16 = hex_rand(8);
        var BnnWnpI17 = new rc4();
        BnnWnpI17["init"](str2hex(QIOY16));
        tmp = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
        BnnWnpI17["crypt"](tmp);
        var eDUJofbg18 = BnnWnpI17["crypt"](a12);
        S10["setPublic"](jCf6, "010001");
        cipher_sk = S10["encrypt"](QIOY16);
        var OkGhwnc19 = "";
        for (var I8 = 0; I8 < cipher_sk["length"]; I8 = I8 + 2) {
            OkGhwnc19 = cipher_sk["substring"](I8, I8 + 2) + OkGhwnc19;
        }
        var nZno21 = function(l) {
            var N22 = str2hex(l + "");
            while (N22["length"] < 16) N22 += "00";
            return N22;
        };
        var m23 = "000000000000000000000000";
        m23 = hex_rand(12);
        var IwIH_Wb24 = m23 + OkGhwnc19 + "00";
        IwIH_Wb24 = nZno21(IwIH_Wb24["length"] / 2) + IwIH_Wb24;
        var goP25 = eDUJofbg18;
        goP25 = nZno21(goP25["length"] / 2) + goP25;
        var zQqhBmvrf26 = IwIH_Wb24 + goP25;
        zQqhBmvrf26 = hex2b64(zQqhBmvrf26);
        return zQqhBmvrf26;
    }

    //真正用于加密的方法，password为用户输入的原始值
    function encryptorPassword(ts, aPK, hPK, password) {
        var strippedPK = hPK.substr(0, hPK.length - 10).substr(14);
        var rsa = new RSAKey();
        rsa.setPublic(strippedPK, "10001");
        return cryptk(password, ts, hPK, aPK);
    }

    function encryptorFactory() {
        return {
            RSAKey: RSAKey,
            cryptk: cryptk,
            encryptorPassword: encryptorPassword
        };
    }
    app.factory("encryptor", encryptorFactory);
})(app);
