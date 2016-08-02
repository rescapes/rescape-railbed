/**
 * Created by Andy Likuski on 2016.08.02
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
p{
    color: $normal-font-color;
	font-size: $normal-font-size;
	line-height: $normal-line-height;
}
.heading {
    color: $heading-color;
	font-weight: lighter;
	text-shadow: 0 1px 0 $white;
}
h1 {
    @extend .heading;
    font-size: $h1-font-size;
	line-height: $h1-line-height;
}
h2 {
    @extend .heading;
    font-size: $h2-font-size;
	line-height: $h2-line-height;
}
h3 {
    @extend .heading;
    font-size: $h3-font-size;
    line-height: $h3-line-height;
}
h4 {
    @extend .heading;
    font-size: $h4-font-size;
	line-height: $h4-line-height;
}
a{
    color: $link-color;
	text-decoration: none;
	font-weight: lighter;
        &:hover {
        text-decoration: underline;
    }
}