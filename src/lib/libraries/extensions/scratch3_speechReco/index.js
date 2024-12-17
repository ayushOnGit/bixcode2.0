const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const formatMessage = require("format-message");

const iconURI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABHNCSVQICAgIfAhkiAAAIABJREFUeJzt3U1sXde55vln7UPSpCRTh6qKHR6KIF28k2qpEQaQu8MLuEMPSk5PSjIQK+mR5SQeuCeUyBgeVKEpDW4BF76kzJEHdsryzJENWOpJWayBmRiwCrCAMGjJo6syWbTIlnRDHlEfpMmz96oBeSSK4sf53Gt//H/AvYEtmee1KWk9+13vWtsIQOR1Dcx1rzZlsiYwWevZbkmywdr/yqpLkqwxWU/KSpK16z+2zshkZWy21M+zVlOP/sJT3liTf/xjdmr9i05LkvHMlA1s3pOXt57NN674+emx9ikBiDTjugAgzbqGv8uuPtzbbQPbLet1G8922cBmjTHd1truchfuSLEmbz07ZazJB1LeyP5V1svLBFOevHzDvvuT02dfyO/+hQDUAwEAqLOugbnulQavt7jAB1bdxtreWC/utbIeEqw1U57RlA3MtGc0aT2bn333uUnX5QFJRgAAamTjQi8FP5GnXhOY7tQv8lWwRpPWmikj+1dJk8YzUwQDoDYIAECZHrXtfdPPQu+ANXkZTcpostgxuDnyownXZQFxQwAAdpF7+3bvE4u9Va/rmvA0azSpwJs0sn9SRpN0CoCdEQCADbqGv8sW7u/rtcYek1WvrHp5so+p9U6Blf2TJ2+CoUPgSQQApFrX8HfZlft7+o0xP7ey/TzdJ5s1mjQyE9baPzXtezhBIECaEQCQKhuf8FnwUQwExppLzBEgbQgASLziHr4ptvVp6WNbZsJac8lk7AQzBEg6AgAS54mn/MAeN0bdrmtC/KzdhuhNeEYf0x1AEhEAkAjrR/OOK9DrPOWj5qzJB0YTntWlxkZ/YvofueoY8UcAQGx1DX+XXbm376Qx9phk+13XgzQxE7L6mDCAOCMAIFZY9BE9hAHEEwEAkceij/hYDwPPPrjIEUNEHQEAkdUxdKfflx3wrPrZ00fcWOudlwkuzY08f9F1LcBWCACIlNzA7V5lzDHJnmLRRxIUTxM0NRbOskWAKCEAwDla/EgPtggQHQQAONMxdKffGntMgU7ytI9UsSZvZS7SFYBLBACEqmv4u+zqvb3HZfQ6T/uAVOwKzI4+d951JUgXAgBCsbbw7xtgbx/YGrMCCBsBAHX1aJJf9rjrWoC4sNY7bzJ2jPcRoJ4IAKiLjqE7/VZ2mDY/UA22B1A/BADUTHGaXwoGeAEPUDvWasrInCUIoJYIAKga+/tAOIpBgGuHUQsEAFSMhR9wYy0IeOcbGwsfEwRQKQIAysbCD0QDQQDVIACgZCz8QDQRBFAJAgB2xcIPxANBAOUgAGBbLPxAPHFqAKUgAGBLucHbJyWdY+EH4osggJ0QAPCEjqE7/YEJzhmrXte1AKgNggC2QgCAJG7uA9LBTDQ2+G8wHwCJAJB662/nG5axp1zXAiAc1nrneekQCAAplhu8M8yAH5BOxRMDs6M/Ouu6FrhBAEihjqE7/YENPuK+fgDMB6QXASBFut6Z614tZD5inx/AZmwLpA8BICVo9wMoifXOsC2QDgSAhKPdD6Bc1mrKZMyrs+8+N+m6FtQPASChmO4HUC22BZKNAJBA7UO3jhtrPqLdD6BaDAkmFwEgQRjyA1AvdAOSx3NdAGqjY+jOwOpq5i8s/gDqwZjg5Mqq9+X6e0KQAHQAYo6nfgBhoxuQDASAGGOvH4ArzAbEHwEghrqGv8v+cH/fR56C465rAZBudAPiiwAQM5zrBxA11mrKM94bN0d+NOG6FpSOIcAYyQ3ePmcVfMniDyBKjFG3VfDl2o2jiAs6ADHQ9c5c94rvfW6sel3XAgA7sVZTTY3By2wJRB8dgIgrHu9j8QcQB8aoe2XV+0v74C1uIY04OgARxVW+AOLOWu9807P3T0+ffSHvuhY8jQAQQV3vzHWvrHrs9QOIPbYEoostgIh51PJn8QeQAGwJRBcdgIig5Q8g8Uzmvdl/+tenXZeBNQSACGDKH0BasCUQHWwBONYxdKefKX8AabG+JfBlx9Cdfte1pB0BwKGOoTsDVsGX3OUPIE24OCga2AJwoGv4u+zKvX3njAlOuq4FAJxiLsAZAkDI2O8HgCcxF+AGASBEubdv91rffs4RPwB4EiEgfMwAhCQ3dPt1+eJyHwDYwqP7AoZu8ZrzkBAAQpD7/a1hyZ5n2A8AtmeMskb6nOHAcLAFUGe5wdvnuNwHAMrEcGDdEQDqpGv4u+zq/b2fS7bfdS0AEEeBzMVn9j14g5cJ1QcBoA6Y9AeA2mA4sH4IADXGm/wAoLYIAfXBEGAN5d6+3cviDwC1Vbw+OPf2bbqqNUQHoEY6hu70W2s/Z9IfAOrDWuVNxrw8++5zk65rSQI6ADWQG7r9Onf6A0B9GaOsAvuX3NDt113XkgQEgCp1DN0ZkOx513UAQHrY8+2DtzheXSUCQBVyv781bBW857oOAEgbY3SOC4OqwwxAhXK/vzUsqzOu6wCAVLPemdnRH511XUYcEQAqwOIPABFCCKgIAaBMLP4AEEGEgLIRAMrA4g8AEUYIKAsBoEQs/gAQA4SAkhEASsDiDwAxQggoCQFgFyz+ABBDhIBdEQB2wOK/tdZmo/0tng4eyLguBQl25caK6xIQd4SAHREAtsHiv6a12ehQR6NeOdykw7kGHco1qLWF+6NQXzPzvn72n/7mugwkASFgWw2uC4iijqE7A9YGZ1zX4VJfT5PefKlFfT2NLPgA4ssEZ9oHb92dG32eW1s3IQBssv5in9T+QunradLQ0T3q62lyXQoA1IQxOpcbur0wO/Lcx65riRK2ADbIvX27V4H9i+s6XDiUa9DZY/tY+BEJbAGgHoy8l2+O/GjCdR1RQQdgXe7t273y9WUaI9GbL+3RmWP7XJcBYAedbRn1/V2TDrZ56mzztL/FU2vL039gzcz7mlkIdH22oO/nfV2fLTioNpoCG3yee/v2y7PvPjfpupYoSOFy97Sud+a6V1a9L41Rt+tawtTabPTe/9WqVw4947oU4Al0ANZ+f/7qxbU5nGpmcRaXAl25saovrv2gKzdWNLMQ1LjSeLFWU02NwcvT/9g+5boW11IfANK6+He2efrsrTaO8iGS0hwAinM49Tpxc+Hqsi58s5zqY5aEgDWpDgBdw99lV+7t+QuLPxAtaQwAYQ/gzsz7OnPpvr64/kMonxc11miyae/Dl6fPvpB3XYsrqT7f9cP9fR+x+ANwae33ZFafvZUNdQi380BGf3hjv879ulWdbelbCoxV7+r9vZ+7rsOl9H3X1+UGb5/zFBx3XUfY/nAyy+IPRMSbL+3R+OABp6dvThxp1vjgv9KbL+1xVoM7tj/3+38557oKV1IZAHK/vzUsY0+5riNsZ4/t06EODn4ArrU2G537davOHNsXiYu2WluMzhzbp3O/bo1EPaGy/qnc4J1h12W4kLLvtNQ+dOt4Gq/4PXGkWb9LZcIHoqWzzdN/HTygE0eaXZfylBNHmjV+ui19WwImOJMbuv266zLClqrvctc7c93Gmo9c1xG2zjZPQ0f3ui4DSL04zOB0Hsjo07fSFwKste/l3r7d67qOMKXmO1w87idjs65rCdvgK/si/QcOkAZxWPyL0hgCjFHW+vbzrnfmul3XEpbUfHfTeNZfWvtDJ4qtRiBN4rT4F6U0BHSv+N7nXcPfpeJBMRXf2dzg7XNpXPyltad/AO60NpvYLf5FxRCQpsFAY9W7cm9fKk4GJP67mtaJf4mnfyAKzh5/NpaLf1HngYze+9WzrssIlTHByfbBW4lfNxIdADqG7vSnceK/iDf7AW4NHd2biBD+yuFnUndPgDE61zF0p991HfWU2ADQ9c5cd2CD1E38b3Tixfj/wQPEVWebp8EEnb4ZPLo3VfMA0trbA5M8FJjY72Zah/42ogMAuHP2WLLa5q0ta5cXpYkxyiZ5KDCRASDNQ39FLP6AOyeONOuVw8l7zXZfT5P6ehpdlxEqY9W7+uDZRN4UmLgA0DF0ZyCtQ38bHcpx5S/gSpIv3kryv9u2rH8qiUOBiQoAXe/MdVtrz7iuIwoOHkjUtxaIjRNHmmM99b+bNHYB1g0nbR4gMatE1/B32bTe9LeVw3QAACfSMHybxi6AMcqurHpfJmkeIDEBYOXevtTv+wNwq7PNS8X8TV9PU6ouByoyRt1JmgdIxHewY+jOgDHBSdd1RElngluQQFS9cjj5T/9FSbjfoCIJmgeIfZ+465257tVVe0bGdSXpdOXGqi5cXXZdBhLm7lLguoSK/OJw8p/+i35xuEkffvXQdRmuDHe9M3dx+h/bp1wXUo3YB4C18/7s+7syM+/rwjdLrssAnGttMalo/xcVtwEWYxrWqlG8H0DST13XUo1YbwHkfn9rmH1/AFFwKJe+yfhDufRuNRqr3tzv/yXWLw2KbQBI+z3/AKIljXdvpDH0PMH6p+L8voBYBgDu+QcQNYc60hgA0vfvvFlgg4/iejQwlgFgZbWB1j+ASEnbi3IkaX8KjwJuZoy6f7i/N5YPpLH77uUGb5/kyB+AqHk2hYshN46u8WSPtw/dOu66jnLF6rvX9c5ct5VNzCUMAJIj25K+s8itzen7d96W1Udxuyo4VgGA1j8AIIqMUXa1kInVVkBsAgCtfwBRdrAtvUfiUGT743RLYCwCAK1/AEBMxOatgbEIALT+AQBxEKetgMgHAFr/AIB4sf1xOBUQ6QBA6x8AEEtWkb8gKNIBgNY/ACCOjFF29cGzkX6AjWwAyA3c7qX1DwCIrYi/KyCyAcBm7OeuawAAoBpRfm9NJAMAr/kFACSBMepuP33rjOs6thK5AND1zlw3r/kFACSG0UAU7waIXABYWW2I9NAEAADliOrdAJEKAJz5BwAkk+2P2kBgpAIAZ/4BAEkVtYHAyAQABv8AAEkWtYHASASArnfmum2gk67rAACgrowGonJDYCQCADf+AQDSIEo3BDoPAF3vzHUz+AcASI2I3BDoPABE8WgEAAD1FIWhd6cBIDd4+6Rk+13WAABA+NwfC3QaAKKQgAAAcCEwwTmXn+8sAKxd+sPgHwAgnYxV71on3A1nAYCnfwBA2lnZc66OBToJADz9AwCwdixwZXHPKRefHXoA6HpnrpunfwAA1jm6HCj0ALDqe6/z9A8AwBpXXYBQAwBX/gIAsAUHXYBQAwBP/wAAPM1FFyC0AMDTPwAAOwi5CxBaAODpHwCA7YXdBQglAPD0DwBACULsAoQSAHj6BwBgd2F2AeoeAHj6BwCgDCF1AeoeAFZXM/08/QMAUJqwugB1DwDc+gcAQJlC6ALUNQBw5z8AAOUzRtmVB3tO1vMz6hoAePoHAKBCgQbq+eXrFgB4+gcAoHLGqLtj6E5/vb5+/ToARq/X7WsDAJAC9eyk1yUAdL19s1ey/fX42gAApIftr1cXoC4BYMVvquu+BQAAaeHL1mVNrXkA6HpnrtuY4GStvy4AAGnkyR6vx5HAmgeAldUGJv8BAKihelwMVIctgKC/9l8TAIAUq8PFQDUNABz9AwCg9oxRdvXe3uO1/Jq17QBw9A8AgPqo8RpbswDQ9c5cN0f/AACol9oeCaxZAGD4DwCA+rLya7YNUJMA0DWwkDWyNd2bAAAAT7LWvF6rYcCaBIDVzOpxGVvX1xYCAJB2tXxLYG22ABj+AwAgFMaaY7X4OlUHAIb/AAAIk+3PvX27t9qvUnUAYPgPAIBw2UL1c3c12ALg5j8AAEJlVPULgqoKAAeHbh3n5j8AAMJljLLV3glQVQDwrVeTQQQAAFCeal8TXHEA6BpYyPLaXwAA3DDW9ldzJ0DFAWA1s8rFPwAAOFLtnQCVbwFw9h8AAKequROgogDA2X8AAKKg8m2AigLA6mqmv5J/DgAA1Fal2wCVbQHQ/gcAIBIq3QYoOwDQ/gcAIEoq2wYoOwDQ/gcAIFoq2QYofwuA9j8AAJFSyTZAWQGA9j8AAFFU/jZAWQGA9j8AANG0+nBvWRf0lRUAjBF3/wMAEEVBeVv0ZQUAa9VfVjEAACAU1trecrYBSg4AHUNz/TK24pcOAACA+jFG2cL9fb2l/vySA0BgG5j+BwAgwqz8kucAytgCCPorqAUAAITElnEcsKGUn9T19s3e1UDdFVcEIDX+cHK/DneU9EdLVb7+51Wd/uNi3T+nVN8v+DrYlnFdRqql9dfeRsaoO/f27d7Zd5+b3O3nlvRfasVv6Dem+sIAJN/+FhPKQnjwgF/3z0C88GtvjbW2X9KuAaCkLQBjKn/fMAAgmRaXresSsIVSbwUscQaA2/8ARMv+lspeZlov+aX0LYZ3lwLXJTzh2Yj9mnCl1OOAu/7X6hia669JRQBS4W5IC2Frc7T2Jb+dLbguIXT3llxX8KRsSzi/JqL2771ZqccBdw0AVqasqwUBpFta28Iz89HeF66Ha7Orrkt4QlihMGqdj62UchywlADw89qUAwC103kgWhP33y+kLwB8ezNaXY/WkLYA7i7HIAAYb9e1e8f/Wl0DC1kjlXyrEACE+STcGaFjd1f+OVpPw2G4HqFtjzB/LSzGYN7DlDAHsGMA8BtW+mtaEYDEC/MPx/0h7fmWYmbBT1UX4PpsQTMR+vc9GGJHKA4BQJJW7u/p3+nHdwwAAdP/AMq0GGJ7NGoX7/yXaz+4LiE0X99YcV3CE1pbwvus72My72F2WcN3DADs/wMo18x8iAEgYnMAl1MUAC5fi1YA6Gyr/w2ARXdjMui62xzAtgGA/X8AlQjz6ehQLrw/9Etx5caqFmMwIV6tmXlfVyLWATgUwhXARfdi8j3ebQ5g2wBQaFhm8QdQtjAnpMP8Q79UH3wV8UPiNTA6/sB1CU/pbAvvEqBrERp+3M1O9wFs+18skNdfh1oAJNzikg1tGC5KpwCKPvzqYaK7AGtP/9E78RBWNyhu9z3sdB/AtgHAsP8PoEJhXYvb2mIiFwIWl2yiuwAXri5HavpfWlv8w7oDIGr/7rvzfrLtj2z7z1j2/wFUJsxrcft6GkP7rFIltQswM+9Hsv0f5ixIlO4+KIW1trwtgK63b/bK2F1fJAAAW7ke4g1xfT1NoX1WqRaXrE5F9H3x1Yji4i9JfX8X3q+B70M85VILxiibe/v2liFgywCw6jfy9A+gYjML6e4ASGvH5JJ0LPDC1WVduLrsuowt/f2/Ce/XQNw6AJJk7db3AWwZADj/D6AaYQ6JdR7IRG4OoOjUHxdjc2nMTmbmfY1ejubTf2ebF+p9EHEMAAq2ngPYegbABHQAAFQszJMAkvTK4WdC+6xyLC5Z/eb83VjPAywuBXrt/Xxkh9/C3AKamffj+b30tp4D2DIAcAEQgGpdC3EO4BeHozcHUHR9tqDhS/ddl1GxU5/ci+ziL4Ub/r6dje5/h51sdyHQUwGgY2iuP5SKACRamNsAfT1NoR0Dq8SFq8saiegA3U5Gxh/o8vXozjG0thj9IsQAELX3H5Rj9eHe7s1/76nfMYH1ePoHULXrs+FeFnPiSHOon1eu0fEHsQoBI+MPIjv1X/SLQ+Fu/cRy/3/dVoOATwUAY2x3GMUASLaw78WP8jZA0ej4Aw1fuue6jB0tLgU6/cli5Bd/STrxYrihL2rvPyjLFoOAW/TMtr81CADKEeYTU9S3AYo+/GpJR0fnI3k6YGbe1y/fz0f2uN9GnW1eqAOAcW7/S9pyEPDp3y3cAAigRr4I+ZWxv3spxJfCV+H6bEG/fD8fqSfKr2+s6LX387Fpc7/2Yrjf66i9/rhswdPd/ScCADcAAqilsBe4N1/aE4sugLR2p/wv389r+NI9p0fLFpcCDV+6H+mjflv5VcgzH/8tQmGtEsYo+/zAXPfGv/fE7xQ/aHjiBwGgGtdnC6HeB9DaYiI/DLjZ2pbAgpO2+8j4A/3v/zCvD796GPpnV+PEkeZQL/+Zmfdj9Qrg7XgNTw75PxkAOP8PoMb+S8jX4cZlG2CjmQVfpz9Z1M/+4W91DwKLS4FGxh/o3/7Hf9Ho+AMtLsfvYpuho3tD/bwr/z16rz+uiFH3xr984hVKnsxPrMJ5jSeAdLh87Qe9+dKe0D6v80BGfT2NkXxn/W6KQWD08gP19TTqtReb9fc1GHRbXAp0bbagT6/+oC/+vx9iuegXhf30L0kXvon+UGRJNp0EeCIABLLdJtxyACRc8ThgmHvz537Vqp/9p7+F9nm1NrPga+aqrwtXl9Xa7OlQR4P6ehp1KNeggwcyOrzD628XlwL9j4VA395c1beza63r6zcLsV70Nwr76X9m3o/UsGZVNp0EeOJXEVcAA6iHP15dDr0LcOJIcyyOs+1mcTnQlRsrWy5Cm1+CFKchvkq4ePpPTPtfeuokwKNI3vX2TRZ/AHXh4rW4Z489G5sTAZWaWfCf+L+kC/vpX0pQ+19PnwR49LujEHgc/wNQF1durIbeRm1tMbEcCMTW3nxpT+hP/4lq/6/beBLgUQDgHQAA6insS4GktUWjsy3ZXYA06GzznIS5OFyHXLYNJwEe/c7gHQAA6unC1aXQL7xpbTE69+vWUD8TtTf4yr7Qn/6lcN9oGRZjH6/1jwOAvC4n1QBIhcUlqz86GMrr62kKdQARtXXiSLOTy50uXF1O5FxFEGzRAQhEBwBAfbkYBpSkwaN72QqIoc42z8ngn5Ss4b+NjDGP7gJ43AGwpttFMQDSw8UwoMRWQFy5av1/vc2xy4R4NPDvSVLXwEKWlwABCMOIo8Gqvp4mnT32rJPPRvnefGmPs/c6fJrQp39p7Shg1/B3WWk9ABQaljkBACAUrroA0tp7Al45/IyTz0bpOts8nTm2z8lnz8z7ibhAaierD/d2S+sBwIg7AACEx1UXQJLe+1Ur8wAR1tnm6bO32px9fiKP/m1i128E9CTJt0++IQgA6sllF6C1xejTt9oSf0tgXP3hZNbJvr+Ujqd/SY/uAvDW/4IOAIBQuewCdB7I6D+fZCgwas4e26dDHdu/6Kje0vD0Lz2+C8Bb+3/mJzv+bACoMZddAGltKPDcrxkKjIqho3v1O4f3NVybLaTj6V+StZn90noAsKIDACB8pz+55/TzTxxpcXbOHI8NHd2rQcffh999dNfp54epePPvegDgCCCA8M0s+E63AqS1S4IIAe68+dIe54t/Um/9247duAXAJUAAXPnwq4f6ft7tH76EADdOHGl2dtyvaGbe1+jldOz9b/D4HgAuAQLgyuKS1f/z/7rdCpAIAWF786U9kbid8cOvllL19C+tXQYkSd7zA3PdjmsBkHKXr0Xj6tXBo3u5LTAEQ0f3On/yl9ae/j/86qHrMpx4fmCu22tuCnj6B+Dc6U/uhf664K387qUW/eeT+7knoE6iMPBX9Nr7edclOJNpymS9QsAtgADci8JAYNErh5/R+Ok2bgysodbmtRcyRWXxHxl/kLrW/0YmMFmPa4ABRMWHXy05e2XwZp0HMvr0rTYdyrm7mCYpitf7unq5z2Yz835qLv3ZjvVstxd4hgAAIDJO/XHR+amAos4DGY0PHmA4sAp9PU0aHzzg9Ia/zdLc+t/IK74UAACiYHHJ6tQfF12X8YTBo3t17te8RKhcZ4/t02dvZSM1TzF86X6qW/9FNrDd0fmuAMC6KzdWIzMPUHTiSLM+fatNfT2NrkuJvLWWf9bp1b5buXB1ObVT/1vxJN4ECCB6RscfROJo4EadBzL67K02ugE7ePOlPRofPKC+nibXpTxhZt7X8MX7rsuIDut18SsYQGT95vzdyMwDbFTsBkRlqC0K+nqaNH76gM4c2xeplr8kLS4Feu39vBaX3R8zjRLPyHS5LgIAtrK4ZPWb83cjcT/AZp0HMjr361aNDx5IdTegs83TuV+36rO3spEa9NuIff+nWeun+FctgFi4PlvQ8KXotm4P5Rr03/7Dv07dtkBrs9HQ0b0aHzwQ6U7IyPiD1Lzmtxye5+2PZlwDgA0uXF3WwQOZSB/HO3GkWSeONOvC1WWNXr6vmYXodS1qobXZ6M3/Y49+91JL5Fr9m33w1cPUn/ffSYOVzRrXVQDALkbHH6i1xejNiE2Wb1YMAldurOjCN8uJefrs62nSmy+16JXDz7gupSTXbxZ0JsKdI9estd0NssqKBAAgBs5cuq/9LUYnjrS4LmVXfT1N6utp0uDRvfri+g/6w58fxq4rUHza7+tpjNxU/05m5n399vxd12VEHlsAAGJl+NJ9Hco1xuaK3s4DGb350h69+dIeXZ8t6NNvlvX1jRVdny24Lm1LnW0Z/eLwM3rlcFOsFv2imXlfr72fZ+ivBPH4HQQA6xaXrH75/oI+i+E9/YdyDTq0/hrcmXlfV/77qr649oO+vbnqrDvQ2mz0i/+1Wf9LLqP/8/AzOtiWcVJHLbD4l6fBGC4CAhAvxRDwX08f0MED8VywOg9k1Hkg82iCfmbe17ezBV2bLej6bEHfz/uamfe1uGxr8nmtzUb7Wzz1/V2TDrZ5Opxr0KGOhlgv+Bux+JctG6/4DADr1kJAXp+9lY1tCNioGAg2D9ktLgWPtgtm5n3dXbZaXHocCr5f7xwc3HAEsbXFaP/6gn/wQEb7W0xiFvqtsPiXzxgCAIAYm1nw9cv38/rDG/tjtx1QqtYW79FefF+P42IiiMW/ctE+xAkAu1gLAQuRHapD/bD4V4cAACD2ijMBF64uuS4FIWHxrx4BAEAiLC5Znf7kXuReI4zau36zwOJfA8ncNAOQWsWrX6N8bTAqd+HqsoYv3ufNfjVABwBA4oyOP9Bvzucj+RZBVG5k/IFOf7LI4l8jBAAAiXT52oqOji7o+3naxHG3uBTo9CeLvNinxggAABKreEzw8rUfXJeCCs3Mr30Pk/JSpSghAABItJkFX785f5fhwBi6cHVZR0c54lkvnqzJuy4CAOptdPyBfvYPf2NLIAYWlwINX7rPfn+deVaWAAAgFWYWfP27c/P64KuHrkvBNr6+sTa78SHfo7qyVlMUfzbVAAAWc0lEQVRsAQBIlcUlqzOX7uuX7zMgGCXFp37O94eHAAAgla7cWNW/OzfPbEAE8NTvBgEAQGotLtlHswEMmoVvZt7Xbz66y1O/C57Je8aYKdd1AIBLMwu+jo7O6/Qni2wLhGBxKdDI+AMdHV3Q5esc0XTBWOW5ChgA1l24uqwLV5d14kizho7u1cEDGdclJc4HXz3U6OWHTPdHQIOR8tZ1FQAQIReuLuvKjVW99mKzfnWkmSBQAxeuLmv08gNa/RHSEMjeNa6rAICImVnwNTr+QJ9+s6y+nkY6AhVYXAr0wVdL+vSbZRb+iLHWTLEFAAA7mFnwNXPVZ2ugDMWF/8M/L9Hqj7AGSVOuiwCAOCjOCPT1NOnEi806caTZdUmR8vWNFY2OP9SVGyuuS8FuTDBNBwAAynTlxoqu3FjR6OUH6utp1GsvNuvve5pcl+XEtdmCLl/7gaf9GGownplSwBggAJRr4/ZAZ1tGvzj8jI4ebkp8GJhZ8HXhm7VBSZ7248l4zAAAQE3MLPj64KuH+uCrh+psy6ivp1GvHH5Gf9/TqNaWeN+5trgU6NpsQePXVvTFtR8Y6EsAG9h8gwn8KcuFgABQMxs7A5LU19Okw7kGHT289r9RDwTFBX/tCX9V128WaO8njCcv39DgBfnVINq/GAEgzoozA8W3EB7KNejggbUuwaFcg9NQUFzsr88W9O2sryv/vMITfgpYz+Yblle8fIaNAAAIzfX1BffytcfX4LY2ezrxvz2js//+2VBqOP3Jor64tsKTfUr5K36+4dZY+1Ru6JbrWoBQdLZl9Nn/nXVdRqL99qO7usaLdcq2uBzo+s3wnrxnFgIW/xS7Nda+PgRoTV7G8qciUuFgG5e41NOzEd/fBtLOWuWl9dcBW9m823IAAEAovLW3AHuSxCuBAQBIB7OpAzDtthwAABCGIAjuSsUOAFsAAACkgvHMpFTsAFi2AAAASAWzYQsgY3gjIAAAqWDX1vy1AOAVplzWAgAAwuHJe9wB0MqeKZfFAACAcDTsu/94BmB6rC0vaxgEBAAgwaxVfvrsCxs6AOIyIAAAEs97PPTvPf57a8cCAABAMlk/eHTvz4YOQMBlQAAAJJjnPT719zgAcBcAAACJZs0WWwDcBQAAQLJ51nu03f8oAKwWAmYAAABIMOs9Hvh/FABujbVPcRQQAIDkmn33uac7AJJkjZ0KvRoAAFB3dtNpP2/Tj/81xFoAAEBINh4BlDYHACvmAAAASKDia4CLnggAnAQAACCxtg8AnAQAACCZjPfkfT9PBABOAgAAkDzWKr/xBID09BAgJwEAAEgYs8X7fp4KAOIkAAAACRM8tbY3PPVzrCZl9Hoo9QAOfH1jxXUJiba4FLguAcAmG98BUPRUAGjKFCZWg6dzAZAEMwu+XnufMRcA6bLxHQCP/t5TP2tlz1QYxQAAgHDcHPnRxOa/91QAmB5ry1txIRAAAEmw+Qrgoq2GACUGAQEASIagnADAlcAAACSCUeFPW/39LQNAU6YwUddqAABAODKZ0jsA0+92THIjIAAA8bbVDYBF280ASIZtAAAA4myrGwCLtg8AW9waBAAA4sPKbrn/L+0QAIzsxfqUAwAAwuDJm9j+x7bRUGhmCwAAgBhr2He//C0ALgQCACC+rDGT02df2Hagf4cZAMnssHcAAACiy9hgxzV8xwDgyUzUtBoAABAKu8savmMAyBSadvyHAQBANDXtezix04/vGACYAwAAIH522/+XdgkAEnMAAADEzW77/5LUsOsXkb1oZQZqUxIAYDvfzxc0Mv4gpM/yQ/kcuGGU2fUun10DQEOheXI1s5qXsdnalAUA2MrMQqDRkAIAku3myI8mdvs5u24BTI+15XkvAAAAcVHaCb5dA4AkWWsvVVULAAAIhTWlrdklBYCmTGGiqmoAAEAojKlhB2D63Y5JazVVTUEAAKC+rNXU7LvPlbRtX1IAkCRTYksBAAC4sv3b/576maX+RF4PDABAtHlGH5f8c0v9iQ2F5klZs+OtQgAAwA1rlS/l+F/RrvcAFE2PteVzQ7cnJfVXUBcQCa0tRmf//T7XZSAkX1xb0eXrP7guAwiFteXd3FtyAJAkefpYAQEA8bW/2dOJF1tcl4GQzCwEBACkhmfK26oveQtAkhpXGpkDAAAggnxfE+X8/LICwPRYW77UG4YAAEBYzMStsfapcv6JsgKAxK2AAABEjvVLnv4vKjsANPlN58v9ZwAAQP2U2/6XKggAbAMAABAl5bf/pQoCgMQ2AAAAkVFB+1+qMACwDQAAQDRU0v6XKgwAbAMAABAFlbX/pQoDgMQ2AAAAzlXY/peqCABNftN53g0AAIA7jc8uV3xBX8UBYHqsLR+YyvYdAABAdaz1zk+ffaHiB/GKA4AkZeSPVfPPAwCACpmgqq34qgLAzZH2CbYBAAAIl7Wamht5vqr381QVACTJGroAAACEy5uo+itU+wVMIeANgQAAhCjwC2er/RpVB4DZsY5J7gQAACAslZ/936jqACBxJwAAAKGp4uz/RjUJANwJAABA/VmrfDVn/zeqSQCYHmvLywQ1SSQAAGA73sVqzv4/8ZVq8UUkycgyDAgAQB3VYvivqGYB4OZI+wTDgAAA1Etthv+KahYAJNVsMAEAAGxS4zW2pgGg0W++yDAgAAC1Za2mZkfbz9fya9Y0AEyPteW5GRAAgFqr/ua/zRpq/QWbCs3vrTasDNf66wK1MrPguy4BIbm3ZF2XUJbWZqP9LbXdmd0Ovw/ipZbDf0U1DwDTY235Hw/dvujJHq/11waqNbPg62f/8DfXZQBbOtTRqM/eyobyWb98P68rN1ZC+SxUx1rv/K2x56dq/XXrEjV5TTAAALVhMrYua2pdAgBHAgEAqAUzMfvuc5P1+Mp122wy8mu+XwEAQKrU8Xh93QLAzZH2CWs1Va+vDwBAktXj6N9G9R43ZRYAAIAKGAV17aTXNQDwlkAAAMpX76d/qc4BgIuBAAAoX72f/qX6bwGoqdD8Hl0AAABKY62mfF8T9f6cugcAugAAAJTB6uNavvVvO6HcOUkXAACA3VmrqSAIzofxWaEEALoAAACUIKSnfymkACDRBQAAYCdhPv1LIQYAugAAAOwgxKd/KcQAINEFAABgK2E//UshBwC6AAAAbCHkp38p5AAg0QUAAGAjF0//koMAQBcAAIDHjIKzYT/9Sw4CgEQXAAAAKZw7/7fjJABMj7XlJf+0i88GACAqwrjzfztOAoAkzY62n7fSpKvPBwDAJZdP/5LDALD24QFdAABAKrl8+pccB4CbI+0TkplwWQMAAOEzEy6f/iXHAUCSjHynCQgAgLD5Bf8N1zU4DwBrXQDLsUAAQCpY6513cexvM+cBQJIaC8+c4VggACDprNVU4Bci0fmORADgciAAQCo4uPJ3O5EIAJI0N9J+xlpNua4DAIB6sFZTc+eeP+O6jqLIBABJ8kzgfCgCAIB6cH3sb7NIBQCOBQIAksha77zrY3+bRSoASOtHIxgIBAAkSFQG/zaKXAC4NdY+xUAgACApbCAnb/vbTeQCgMRAIAAgGaI2+LdRJAOAxEAgACD+TMa86rqG7UQ2AHBDIAAgzqz1zs+++1xk33ob2QAgcUMgACCeonTj33YiHQCmx9rynrFsBQAAYsUoiOTg30aRDgCS9P3I8xe5GwAAEBdRPPO/lcgHAIm7AQAA8RCH1n9RLALArbH2Kat4/AcFAKRXHFr/RbEIAJI0N5p7j60AAEBUxaX1XxSbACCxFQAAiKY4tf6LYhUAbo21T3EqAAAQNXFq/RfFKgBIa6cCApmLrusAAECKX+u/KHYBQJKeKTS+wbsCAACuxbH1XxTLALB2QRDvCgAAuOWZ4I24tf6LYhkAJN4VAABwywY6u7YWxVNsA4AkzY78+JSVIvuiBQBAMkX5Nb+lanBdQLWCQvBqJpP5i4zNuq4ljToPZHTixRbXZQCJ0NkW62ey9LAmH/j+y67LqFbsA8Ctsfap9sHZs0aZc65rSaO+nkb19TS6LgMAQmM9e/bWaDz3/TdKRNxcuyWQeYCN8kvWdQkAIuzeUuC6hFiy1js/90/Pv+e6jlpIRACQpMbCM2c4GvjY9/O+6xIARNhdHhLKZq2mmvz7p13XUSuJCQDTY235wA9e5qrgNYvL/OYGsL2ZBR4SymJNPvCDl6fHXkjMGpOYACDx1sCNrt8suC4BQERdn+XPh3JZz8buqt/dJCoASMwDFF2fXXVdAoCI+n6e/f/y2LGk7PtvlLgAIK3PA6T8foDrswUtMuQDYAtfXFt2XUJsWKup2ZEfn3JdRz0kMgBMj7Xlg0LwaprnARaXLG0+AFu6coMOYSnW7vkPYn/efzuJDADS2jyAMf6rrutw6YtrK65LABAx12cLDACWKM73/JcisQFAWntfgLV+Yo5slOvC1SW2AQA84cM/P3RdQizE/Z7/UiQ6AEhrQ4FW+th1HS4sLln98Sp7fQDWzMz7tP9LYsfifs9/KRIfACSpqdCU2pcG/eHPS65LABARF64u0/7fRZKH/jZLRQAoDgWm8abAmQVfH3xFyw9Iu5l5X59+Q0dwJ0kf+tssFQFAWh8K9E0qTwaMjj9gFgBIudHxBzz972T9pr8kD/1tlpoAIEmzY89NSukbClxcsjr1x0XXZQBw5OsbK7rAPNCOrCkkeuJ/K6kKAJI0O9p+3ipI3XXBl6+tsBUApNDMvK/BT+65LiPSbKCzcyO5i67rCFvqAoAkzY20n0njdcGj4w+4HAhImd+ev0vrf0fpmPjfSioDgCStTXmaCdd1hGlxyeq3H93lVcFASpz+ZJHQv4NA3sW0TPxvJbUBQJIaC42vpu144MyCr1++nycEAAk3fOk++/47sFZTzxTuv+G6DpeM6wJce35grtvLeF8ao27XtYSpsy2jz97K6uCBjOtSANTY6U8WWfx3UDzul7ahv81SHwCk9IaA1haj937VqlcOP+O6FAA1MDPv67fn79L23wGL/2MEgHW5gdu9yuhLGZt1XUvYBo/u1dDRva7LAFCFr2+saPCTewz87cSavHy9vHYkHASADTqG5vqtvC9d1+FCZ1tGf3hjvw7lGlyXAqAMi0uBRsYf6kOO+e6uYH7K4v8YAWCT3ODcSRnvI9d1uHLiSLOGju5lNgCIuMWlQB98taQP/7ykxWVu+tyVDd6YHW0/77qMKCEAbKF9cPaUMZlzrutwqa+nSSdebNaJI82uSwGwwdc3VjR+bUV//GaZhb9E1uj03D89/57rOqKGALCN9qG5M0besOs6XGtt9tT3d43q62nUoVyDDuca1NqS6tOjQKhmFnxd+ecVfTvr64trP7DHXyYb6GxaL/rZDQFgB4SArbU2e9rfYtgmAOqkeE8Hi311WPx3RgDYBSEAAOKHxX93BIASEAIAID5Y/EtDACgRIQAAoo/Fv3QEgDIQAgAgulj8y0MAKBMhAACih8W/fASAChACACA6WPwrQwCoECEAANxj8a8cAaAKhAAAcIfFvzoEgCpxbTAAhI/rfatHAKiBtL9ACABCxYt9aoIAUCO5gdu9yuhLGZt1XQsAJJI1eWP8V2+OtE+4LiUJeKtLjcyOPTcpXy9bqynXtQBA0lirKfl6mcW/dugA1NjzA3PdXsb70hh1u64FAJLAWk0FfvDyrbH2Kde1JAkdgBq7NdY+FfgBnQAAqAFrNMniXx8EgDq4NdY+1eQ3/TSQuei6FgCILWMmmlYfsvjXCVsAdZYb+v/fk8yA6zoAIF7s2OzIj0+5riLJ6ADU2ezIj09ZBWdd1wEAcWEDnWXxrz86ACE5OHTreGDNRxwTBIBtWJOX/NOc8Q8HASBEnBAAgK1Zqynjm1dnx56bdF1LWrAFECJOCADA04qT/iz+4aID4AjDgQAgWenjpsLDU9NjL+Rd15I2BACHeJsggDTjhT5uEQAc6xia6w+s9xFzAQBSgzv9I4EAEAEMBwJIC2s0GawGr3K5j3sEgAhhLgBAstmxxsLSGfb7o4EAEDHtg7OnjBqGuS8AQGJYk7eePct+f7QQACKILQEAScGb/KKLewAiqPgyISt97LoWAKicHWvyH/6UxT+a6ABEHFsCAGKHln8sEABigC0BAHHBlH98EABihIuDAEQbr/CNEwJAzHBxEICosVZTngne4GKfeGEIMGZujrRPBH7wMgOCAKIgkHexyX/4Uxb/+KEDEGO5wbmTVt4w3QAAobMmb03hjbmR3EXXpaAyBICYe35grttr8M4Y6XXXtQBICWMm/FX/DQb94o0AkBB0AwDUHcf7EoUAkCB0AwDUDU/9iUMASCC6AQBqhr3+xOIUQALNjraf56QAgOrZsUb/wQss/slEByDhcgM3e22m4XO6AQBKxbn+dCAApAS3CALYlTV5a/yxuZH2M65LQf0RAFKEIUEA22LIL3UIACnEkCCAItr96UUASLH2obkzst7rBAEghWj3px4BIOXYFgDSyI41FpbOTI+9kHddCdwhAEDSWhDINGY+krX9rmsBUCfGTBjrn6XdD4kAgE2YDwCSxxpNejY4zcKPjQgA2BJBAEgAa/KSf3p2tP2861IQPQQA7IggAMTQ+oBfU2H5Pfb5sR0CAHa1Niiok5wYACKOhR9lIACgZAQBIKJY+FEBAgDKRhAAIoKFH1UgAKBiBAHAERZ+1AABAFV7fmCuO5NRP8OCQJ2x8KOGCACoKU4NALVnraYkjTX5D8+z8KNWCACoi9zg3El5mde5WRCoAjf3oY4IAKir3MDtXttgT/GuAaB0gWcuZgJ/jIUf9UQAQCiKLx2S1c/ZHgC2wP4+QkYAQOjYHgA2MGZCgf9xo798kYUfYSIAwJlHryK25piMzbquBwiNNXmZ4GMje5E2P1whAMC5roHvsquZ5uN0BZB4xkzYwF5imh9RQABApDArgMRZ39s3Xubi7LvPTbouBygiACCyDg7dOu5LxzlBgNixJh9kNMEkP6KMAIDIY4sAsUGLHzFCAECsFK8dJgwgMlj0EVMEAMQWYQDOsOgjAQgASIRiGAhM5phn1c+xQtSUNXl5mpTRx40rDzivj0QgACCROobm+gN5JzlNgEpZqylj7CUje7GhsDzJoo+kIQAg8XIDt3ttxvYbzxxjqwDbWn/Kt4G9ZHwzMTvGkT0kGwEAqdMxNNdvZY5bY35urHpd1wN3rNGksfZPPOUjjQgASLWuge+yfsOe/kC2n0CQfMUF35OZyBQeTrDgI80IAMAGXQPfZQsNzb2BvH5jzM8VqJeBwpgqDu7Z4K884QNPIwAAu8gN3O5Vxu+1xuuX0U/oEkSTNZpUoElJf2UPH9gdAQCoQMfQXH9gvV5jbLeM9xM6BSGyJm89O7VxsW/Ugyme7oHyEACAGskN3O71Gmy3L/VamZ8YY7vpFlRh00KfMZrKFILJ6bH2KdelAUlAAADqLDdwu9c0+NlixyCQ12WM7TaB6U5918CavJXNW2MmPQXT1popFnogHAQAwKHi0KGRl/WtumWUtTI/8YyyVjYb65Cwvrgbz0zZwE4ZY+8WF/igYKZo2wNuEQCAGOgamOteVSZrGvyskZcNPJO1ge2WJFl1SZLxTHfx51vZrAI9Cg5l3Ya4vnBv/FvGM1OSFFjljV3/MaPpjT9mAn/KFjL5Rvl5nt6B6PufDe2v1DDvzSgAAAAASUVORK5CYII=";

class Scratch3SpeechRecognitionBlocks {
  constructor(runtime) {
    this.runtime = runtime;
    this._phraseList = this._scanBlocksForPhraseList();
    this._currentUtterance = "";
    this._speechPromises = [];

    // Initialize the speech recognition object
    var SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // Set up the recognition event handlers
    this.recognition.onstart = this._onRecognitionStart.bind(this);
    this.recognition.onspeechend = this._onRecognitionEnd.bind(this);
    this.recognition.onresult = this._onRecognitionResult.bind(this);
  }

  get EXTENSION_ID() {
    return "SpeechRecognition";
  }

  _scanBlocksForPhraseList() {
    const words = [];
    this.runtime.targets.forEach((target) => {
      target.blocks.getBlock((block) => {
        if (
          block.opcode === "speech2text_whenIHearHat" &&
          block.fields &&
          block.fields.PHRASE &&
          block.fields.PHRASE.value
        ) {
          words.push(block.fields.PHRASE.value);
        }
      });
    });
    return words;
  }

  _onRecognitionStart() {
    console.log("We are listening. Try speaking into the microphone.");
  }

  _onRecognitionEnd() {
    this.recognition.stop();
  }

  _onRecognitionResult(event) {
    var transcript = event.results[0][0].transcript;
    var confidence = event.results[0][0].confidence;

    // Process the transcription result
    this._currentUtterance = transcript;

    // Run through the phrase list to see if the transcript matches any phrases
    this._phraseList.forEach((phrase) => {
      if (transcript.includes(phrase)) {
        this.runtime.startHats("speech2text_whenIHearHat", {
          PHRASE: phrase,
        });
      }
    });

    // Resolve any pending promises
    while (this._speechPromises.length > 0) {
      const resolve = this._speechPromises.shift();
      resolve(this._currentUtterance);
    }
  }

  getInfo() {
    return [
      {
        id: "SpeechRecognition",
        name: "Speech to Text",
        blockIconURI: iconURI,
        color1: "#d4b77d",
        blocks: [
          {
            opcode: "listenAndWait",
            blockType: BlockType.COMMAND,
            text: formatMessage({
              id: "speech2text.listenAndWait",
              default: "listen and wait",
              description:
                "Listen to the microphone and wait for the user to finish speaking",
            }),
          },
          {
            opcode: "whenIHear",
            blockType: BlockType.HAT,
            text: formatMessage({
              id: "speech2text.whenIHearHat",
              default: "when I hear [PHRASE]",
              description: "Hat block to trigger when a phrase is heard",
            }),
            arguments: {
              PHRASE: {
                type: ArgumentType.STRING,
                defaultValue: formatMessage({
                  id: "speech2text.whenIHearHat_default",
                  default: "hello",
                  description: "Default value for the when I hear hat block",
                }),
              },
            },
          },
          {
            opcode: "mostRecentSpeech",
            blockType: BlockType.REPORTER,
            text: formatMessage({
              id: "speech2text.mostRecentSpeech",
              default: "most recent speech",
              description:
                "Reporter block to return the most recent transcription",
            }),
          },
        ],
        menus: {
          // Any menus required for your extension blocks can be defined here
        },
      },
    ];
  }

  listenAndWait(args, util) {
    return new Promise((resolve, reject) => {
      this._speechPromises.push(resolve);

      // Start the speech recognition
      this.recognition.start();
    });
  }

  mostRecentSpeech(args, util) {
    return this._currentUtterance;
  }

  whenIHear(args, util) {
    const phrase = args.PHRASE;
    if (
      phrase &&
      this._currentUtterance &&
      this._currentUtterance.includes(phrase)
    ) {
      return true;
    }
    return false;
  }
}

module.exports = Scratch3SpeechRecognitionBlocks;
