const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const ml5 = require("ml5");

const blockIconURI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAE8CAYAAACFLP4lAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAhdEVYdENyZWF0aW9uIFRpbWUAMjAyMToxMDoyNCAxNDowODo1NIC0f+cAAGFxSURBVHhe7Z0HYBRF28efvZZcciSEEJIQQggkhN6RIlV6E1FpIqIv8oIgoIKKH1hRLKACYn1tiKg0pYmACNKRIi303kknPbnL3X7Ps+Vu73ItRxIul/3B5GZm+8z8p+3sDMOyLMjIyNhHIfzKyMjYQRaIjIwTZIHIyDhBFoiMjBNkgcjIOEEWiIyME+RuXh/DaDTWLCwsjExPT6+LJryoqEitVCqNAQEB2dWqVbsRGhq6WdhVxh1IILKpuMZkMgWlpaX1+Oyzz36MjIzM0mg0RSqVykhGoVCYbA35o1DyVq9e/VFmZmZne+eUjcXIJUgFJiMj44Fu3botPXnyZA0UCkOG/FEIdiNV3E7QPigmY35+vlrwkrGD3AapoGzduvWtGjVq/Hns2LEIrEYpXImDoG3idtq/oKBAhdUvE8MwrFqtNn7yySc/czvKmJFLkIqHeubMmevee++93oLbXDI4E4eItBQRkYoG00Ox7ZUZuQSpYNiKw1OkpYkUKk2oVElISEjZv/+ftwTvSotcglQgNmzY8P6gQYNeJLttSeBO6UE4O066TRSQwWBQCl6VErkEqSDo9foEEoe9KpII5vyApQsU5OcDtks4k5qaCs2bNxf2KBnUthGslRa5BKkgREREZCclJenEHN+eUD777DOYMGECV00SvLh9UlJSoGPHjnD+/HmuZLB3rLQkkWI0Giu1SGSBVAC2bNnydp8+ff7PWekRFhYGycnJggtsI5W5du0a1K5dW3A6xlYolV0gchXL+2GGDh06zZk4iFatWgk2+0RFRQk259B1pNei0ohMv/79itBZl/etPMgC8XIwsUZkZWX5CU6HaDTF3vdRIhcNJXT64aBSwlGVSkQUibjv39v+VmBtYwC3sRIhC8TLuXz5ck9XpQdx5NhxwcZRbP87d+4INh53zilFr9fTm/vBgrPSIAvEy8H2R0/B6pRrV67A7+t/x8ZH8YIhPy8PBg4cKLjcF4ftfl999dX9grXyQI102Xiv6dGjxzmKJjJY1TGJdkfm5eXD2czCFFZvKmQLDLnsjt1/szqdzu6+7hi6pmji4uJM9u7Rl43ci+Xl1K1bN/3SpUshZKe2gLPcX6kB+O+KThAQ7A/+ygAoYgywZNIeuHk0U9ij5NA1BStotVrIycmpVLUOuYrl5bRu3fqaYHVZNapaSwvaqmowsUbIK8qG3OxcSL2QI2z1DLqmeN3c3Fy3qma+hCwQL2fo0KE7pbm4MwJC/UGhskRpfqYe9DlGwSXjCbJAvJxOnTptFawuiWoWBFh48KCkUi7kCg4ZT5EF4uVUq1aNGulmnJUmobUDAYzYsAZ+n/RrvEDoGNFwHh7gqnrnq8gC8XI0Gk26uwk7PD6I73tCSCTJp7M5V2klbrwXwVZ5kAXi5aA40gSrSwJCNGDulGQUkHEzT3Dw3K1QHnn4EY9LoIqKLBDvR+9uCeKnU4M4okShpCpWAeei4+9WHMHBwfDDkh8qXaNGFoj3YxoyZMhFwe4YFIRCgRoQZYBKMepLrwcrJycH8vPz3e4w8BVkgVQA/ve//70oliKOSgJddQ0Yi4SCBn84cZRiD6/RaITRo0Y1FZyVBlkgFYAqVaqsadas2W1nVS16ScgaaSQK307PTS/k7KXJmnXrYgVrpUEWSAXh77//HiFY7VI1KsDcQKciJie1gHfI3BWyQCoI2Eg+rFKp+CLCDlFNgs3tD0apgNtns3gHUprvMMRZT3r37k3tIm6MmC8jC6TikN2qVasbgr0YVaMDQMnwVTDqyUq5mFNqorDHyZMn6+DPZN7lu8gCqUBMmDDB7rgsjU4J1WvrBBe2QUwmuHXaUoKUNljdg6tXr9IoyL94H99FFkgFolu3btzM7LYi0QYpQRNomb7KUGiC/HS94CodxGvS76VLl6iq9R06/yE/X0YWSAWievXqdsdlhcVVAaXKIpCclEI0pSsQEZrl5IknnlCgQKaikyZy8GlkgVQsilWviKq1qAdL2IQ/WbfzeXspUpoN/YqELJAKRHZ2NrfMgeA0U7NJCJiKLO9Abpz2/AtCGWtkgVQgzp4924J+bUVStaYfNsx5O23IuFL6Q6bsdQ5UBmSBVByYBQsWPCrYrQiN0rHmdyAYo8kX7+4zW3vIVSwZryY9Pf2B1atXNxGcVqi1KssYRYUCMq7ybRDK9Usz5w8PDxdslQdZIBWAc+fOPRUbG/u74LSGOq9QAgrhJSFHGX2G3qlTJ8FWeZAF4sWwLBty9OjRKY0aNfo6JydHY6+aExyuxeoPb2cwOosKTaVaHZKWQi1btqx07RBZIF7KkSNHpnbs2PFIq1at5jtbpyOsZgi0rtELOkQNAp0mBHKz+a8Iy6JRXbdePcFWeZAnjitDMNfviKaGMMCvyM/PL7tKlSo7hM3F0Ov1DW7cuNFmyZIlw998880BVBJIE7ptyfDBBx/A9OnTuQGEvA8LWTnZEBYaxtBcugQd76xEEc8v7uNIWLT9ypUrbO3atStXpkoCkU2pGY3RaKy+efPmd4KCggqcrVXu7+9vqFq1an6TJk1ut2/f/opOpysUt1O0kJHabc3w4cNpeTS8JAdNCcoZYt68edw+zo4nI17P1X6iSU5OLsRr2HtunzV2PWVTYqM4c+bM2DFjxuynhfxLkujsGXcSbm5uLl7WjFkgZFCkbPfu3UtVIOHh4Sas6p3H89t7fp81chvkLsnMzOyM7YRrjRs3/mrx4sVtS7KuHyZMSnwOEas9BO0rGiUoISAgQNjCJWArsMoFzZo14+zOrkHnF43gZZeYmBj2m2++oTUQ1wpelQa5DeIhKSkp/ceNG/fBn3/+WZ8W5Cc/SmjSBOkq4dG+jvax3UbumtoYmND2FYjwi2L+s74fMCpus70IZAYO6A9/bNzEbXN2H7R0W+vWraFfv36mwsJCNi8vj9KEIiI8HMLDI0wNGzVkExISjCg6GrnbC03pf8vrxcgCcQ2DCafprVu3mh0+fLjNsmXLuq5ataoZJTox4TnKpW0TuK2bfp0lXpEQTShMaPl/UC+0ATD4jw7s9XprqH1fDX4HHvM9ZBhM8MSbc5gN775u9rN3HVoVd//+/aYWLVr8hPezHL1uo6mCJhQNjdSlrwaPoqm0yAIRwHCogtWjGlh/16JdffXq1dbffvvt8IULF3ajahMlMDLShG4rDGkiFPez3cce0uMIOkanDIY+dR+G3vWGMEpGCXh1lsTBYeItXV9qDvW61rQ6PznmnLgCRUYTHFjxI/wx5w1+gwTxeu+99x778ssvy9VsJ8gCwTDYvn37a++8886oxMTEiIyMDK0oCNpom+gFqxW2CVyKOwIhpOfoGfMgPNpwLGiUNFMitZ9xk8JSQmBTHGtXGjibkQhPrhoC8REkEtxHfwW230yCv7Nr8jtivejgsh/YDXZEgm0YZubMmTBjxgyH9y5TSQWCiTEM2xDtL1261GjYsGGv3LhxI8hWCOQWE7etABz5i9jbTn46nQ5q1oyCy5cvcWv+SYkOqMtMaPUKhOtqYgFBRYT1qSmeVAo1nEs7ARsurIDDKXtAGR4Pe9ePYtuGpfI7MSz8VvAgHCuMx4OFdyN43MEVS2H926/aLc22bNkyu2HDhv+iloxarTYzKChop7BJBqksAqHU5o+N6fjVq1dPGDNmzH/FUsJeopHiSASOsD0fHU8rM509e5atVasWJXTufJmZmWyf9gOgdUA3aBvVGYsHPEyoOnFgicGVFKCCAmM+fP3vPDiRfgjy0S6i6fI0JH5SDeKrFnDXNKmVMPjJ36Hlu+sZpUrFYgnC7UciycvKZD7o3NLu/ZEfGZo1xd/fv6h///4nFy9e/AS6T9Eu/J6Vk8pQ/wxYsGDBz3FxcdcDAwOPjBo1agLm3sqSJnx3ofNKDfktWrTIvE45vfUmU7VqVVi/Zj20jSZxWKdBEovCpMDkzcB3xxfA9C1j4GDKLrM4xESuqdUEAv0kIxNNRcyd9Ezmh/Gj0Sr5GhbPFBAUzPafOdsseOn9EZRhUG/cnTt3/H/55ZeWWJIcxSrnZ8LmSotPliD4TNWzsrIaXbt2rUnbtm0XSAVBiYvs4i93gBPExEi42l+6r8jLLz4Pc96bR1Y6ttj2i9tvwvYPj9E902wkjEbhB/uu/w0/nPwMcvQZwl527kMXCsGTV8Glp1dDiMrEbTPg35a9l8CJsxmM2t+ffWX3MVCoVJxAOISSZF7X1tbnsgNdj4zBYLB87F4J8bkSZPPmzXMSEhJOR0RE/NW8efNF4jsKMcJFuzviKCl0zvBQP2bAA9HM4oU9mKPbHmPeeO0Juo7Da9VoEMLQvLcqVsWcSzsFc/e+Ap8decdKHFLE+1aGxoBCEwAahaUEKTKZsOrGt22M2Mb5bvxoxrYk0QYFQ79X3jSXcGK42BravSzCqKLhEyUI1ue7HD16tNvLL788dv/+/dFixAubuYi2dQtWl0iPkxISrIH4OlWYJx5tCC1aRkLjhGoQ4IctBqot8Rk6n3NXfwIreW3IZXse7h5SrqRDr9b94VTaYdDjP3fR9psGmtaPQOr4pXhNJXfu5OxCaNDxW8jIMpifV6nRwIzdR0GpUnP3g574h4UDK36CDW/Pol0cPiNBs5gI1kpJRRZIAJYOddu1a/cn1pXDbUUgxdk2Kc6EQ/WMpo1CoV2bCBj1UAI0aRoOwSgI0gBDgqCzFzsaPbRNAcLGkUN6ffOe1D6ZPJmfoFC8R1cCpv2Cx37DQFgcpD/zMx6ADXLkamoeNOqyGHJzLQIhotu0g9GfL2aUajVdmPdXKODALz8yv789k3MS9sJIFkgFFMi2bdvexIQ1RPwEVUxQjkTgKsHZUj9WB/e1iIRHH6qPJUMYRNfUYVUGm8xGPD1dwdnZuDvAP6QcNcnKBCn5bSCs7hPSe+PCHRvDMGbMGKrnl+j+iLDXdkER3k/6Mz9hKlZz5z56+Q60fuAHrLJZi43sjErFzNibCGqViqVeAnqGzmHBEJt3B6g7YOfOnfDW7Lfg4oWL0vuUBVKRBJKSktJv6NChizAyzdPwOxOHPWHY20+rVUKvTtEwfEh9pknjMKgbHQxaWk7ZaMIAEnZylIRxO4UhQ4vX4DFF+JuZng9rN1+AXftuwLY91yElQw8rVqxl+/btwx+CSfT06dPQtm1bGpXr6MxOUELYm7uo6wmSx2MJYuRLkL2JydBxwC9W4SENg5i27dgxn/8ADJYkExOimBp+ljUH6Rmo65m6ovPzLV3JskAqiEC2b9/+es+ePV+j7khyOxOE7TYxF1UxJua+luHQqUMUDB2YADWjgyC8Cp9IGG5tDSEtOUqyWJWiEzMaLBmUKIRsPezcfRW2/3MD1v95CW7dzofMnOLtCOn90DsRaQK0J2JXKMPjoNr478CfMcLVccvNAtm04zL0Hb3WHAb2zk29W5vPXoJu0RHkLLadhNumTRtWvEd3BFK7du07SUlJOoyjze3bt+8vePsEFUIgX3zxxRKspz9GES4VAebAEB0dDTRX7OHDh7l9bWnfMgxaNwtnhg+uD7XrhkCtEH/On6sucRb+xy64C1c6oBgA2xv6fAOcvHQH1q0/C6s2nIebybmQkua6YW0rWCmeCETTpB+EPPQKBKiNcPE/K/Ek2EjHKyz7/RyMmPSHOXwcnfvmrVsQGRFB91RsOx4DWEqzWH3l3K4EguETqVKpuFnnmzZtyh45csSnuoW9XiBYBbmvatWqe6WRPXLkSOazzz6DoKAgLpLpGbBkgdmvjoPaoZehe7c4Nqy6H1NFg41oKhnER3SWFKmhjQ1XUDNgwEOSbmfDynXnYN/B27Bz/w3IyNRDvoM1/8TEaCsETxK/OwSPmg+auq2gZkABHBm1Bp+PF8j874/A82/s4K7pTCDozzVDJJgdFJZz585lX3nlFcGHZ/6C+YWTn51MI31t5+PVKJVK82o9vlYl83qB1K9fP/XChQvVBCeEhoZCcnIyRaidZI9eqT8A5B3i7fYQu2CxRAAVA7dT8uDsqVRY8usp2Lr7GtxKzscqkPvz5jhLiGWCLhRCJ68AhUoNjapmwd+P/oGeKEwU9cyPd8OchYe4e3F2X2fOnKFwFVzWGPR66PZAd3bf3n2CD88zzzzDLlq0iNYoPMn7WMBqIx6m50oOXxOIVz/Mn3/++Q6JgyJaNA8//LCtqCUOTA/B3fCX2hMCuJUlUVA1SauCO1gK7MbG7LQ3/ob7+/0Mjdp9D10f/RW+/ukUXLxCK7kaucTlzAhn5ihXcSDK0Fqg8NNydq3SwP3iXeA9sJB2x/Itk7P7eu+997iSAqE/VuavrVthz+495qqsSEpKCrkb8C5r7r///suC1efwZoGoHnzwwZdsI6pr164gVA/oj2gsqGpw1SQWG9KnrmTCG/P3wcCn10P1pl+CX+R8CEn4AjoNWgEffXUU9hxKggyhUW2b8B1R3oKwRdO4N90ElwWEYxUL+LGPGAoM3Lrl3qpS3333HXz2+efis5jN9aPHmIH9+tEuHNJnPX/hAv3EcQ4b+vbty31Uda/DpizwWoHk5+c3FYttKViiCDYuxytGWmo6DH5iHTTq/D206LkE3px/EDb8dQXSMvRQisuG3zM0UQ0xJeKDoDCC/MQShCc3V1wH2jVTp0yB97t2Bnbx9wArVgA7cQL8+/Bgh5Mypqak0E8Y57AhPj7+qmClrxRNo0aNOpaWltYnOzu7U1JS0oP79//z0rZt297C9mR3YbeKAxW13miee+65bZirU0ZpLv7JBIfHcFN32APrvyxWwaz2Fw2dy56xt69o7O1vz9g7tqxM6Ku72LBZO9iQWbvY15f/j2UvT2bZK8+y7NUppsb1Q0p0L0uja7HGls1YExr6nRMeVmwf8RkDAwMp2H9AUyyusCr8tjQcxGNoeiMyop1mfLF3vDcbryxBsKiugQ3CLoLTCn18d1h7LImLCSn0MF9//TWsWbNG8LGuNlHxb88Im+1ib397RnqdskXJNc65t/R4xer+0i5mBvLzSlZERvmpgaEvFrFGSgFx2eYjLin6/HwKD/pWvRh79uxpTuEgOM2QH723EsOJ7MKmCoNX3vDHH3/8qRiwghdPaAzouv0Hxq48B/Xe2QNf7bkBf+05CPPmzYP77rsPxo8fT70ows58BAnWMkW8TlkLRRkWA2Dkq1X0bVWE1vLCERQsk5vv+p2MSDCaWH8/3iHc/8kCx8dTqBoMBvNcQxICMb56OsqMBK8Ki1d281I9ln5tA1jbYyLoOj2OqjZy62Hoc3OZjEUjscFif2g4QRFHn7piFQE0/v6gVlF3Fg9to2vQb2BAINSuHQ3Vq4dxU+H4475BQUGA1QKuU0Dcl8IrOTmZawthzkkvKbnjxfOUZaLQNO8PwYNexlhTgN6kgF/6bIe+tW9SCQCsSsWGJHzCZOa4V4pEKpVwvkkCaGlBESSfYdj7Tp2DEwUF3P1Ln4nbAUlJTd1fLSSkveDk2L1798wuXbrMJrvts4vHSs8j2j94/wPjtOnTqNv4NPl7K14nkJs3bz4cHR290l5CC3t1F/41YcDTCCkWMtbOZfSH1/EbbWjevDmsX7+erVmzJr0Uu42G1iWjl1yUTVI2TA9OhlII/ZJ/NhpqjSajoQ+9SXm0njJl1SRaGpdCv5STRuA9xjdq1OipM2fOcP2uYqIie1mge+xD0Na7j7PTZf4YshnahqVzbkCBqGrP5wYqukM7rQb2NWiIVVM8AO/7WlERNE08DVnC/YvPIiZs4sqVK4m1atXiZ6QTiIiIyKZhJoLTCnvnEN1PPvkkVYk/wniZLmzySrxOIFhVunbgwIFagpODC+gqEUzY1BWg4MaWUypVMinv9sZkXXw1pccffxzmz59vDA0NnYLOMv1sNCMjY0j16tVXicIQEwW3sTRRaiFk6jJQBYbgNVDQGAp/DdnANK5GmkZQIEzUfLev+zCWqivr1yUrF57HCwqh+ckzdo8XEziWludq166dwHnyBGFpf8fd55UKhUr1vXv3nscMxv4bSy/Bq9ogOTk57Q8fPizMWWONbuCLGJV89kgjJfTJF+2KAwXPLFmyhEFx0JeEZf5NdUhIyG/0K438skBZKwFUQZKJ4gx5TKDyDm9n8dolvHpDLbY/hGNQ0cyl/DyXiRzD1jL8F9Hr9bGeZgYY17Bm9Wq771W8Ca8SyPDhw7+zF+AmRsVo4zugTdiE9eacNe+ZEyX9kunbhx9OXt6oVNx3hGWKpmF3GschuFjwTz0BwSrLm/PCIjfrVgItaG5ffpJGCkD2WJ55OJUzrGVIo/w9zBgonmPq1BFc3ovXCAQDrMbGjRsTpAIRA19ZG6u9Rj26+QjS3zoD7O2T5oihY8i8/8EHHkXW3dK9e/eL0vsuCzS1sD0rlKAEczsRAvyoF4rCiEWBlEyjERq1ObXTvTvr4hXB9oLVvLwlKbbEuJSGk1qtFmzei9cIBBtsc+0mMqUGggbRyFKx9GAgb31xIYwbN45mNKdRiuXO+PHjt3iak7qLJjJesCFYggZe3Ql+2NDmwCtn5tsOsnVOPT8N19tAUCI476SLV4wXTNBCg4cHn/muMoVTp2jaLe/GWwSifeONN4bYJjKKGGW9+0BVjW+WUNsDvRhj0jnOTdAx0TEx8H//93+UvQ7hfcuXLl26bBCsZYeSXhAKdlCCjsniMgsO/NEXlEwgVZVKS+Sj4K67UYKgQCQvXjj3FcFqJi4+DoY++iiMGD4cGjZsKPhaEOMYj2VpVnlvxysEcuHChWHUVWivBKlK/f5FBr56hRGZf3SDVTFNw6uvXr7M1KlThxrl13nf8gUb6v8K1jJBGYZtWRMJgB6bBZOhkKlR3R+dYn7CQE626wQuRa2wHuZ23Y3+Ya1Wa1uPS1+0aJF5+Pv27dvh7JmzsHzFCvj5l1/gxIkTNHs8916J4kyMN/rt0KED9OzZk7rQvRqvEEjXrl0XClZrsHqlqFId41/QA6aHnP2rOKs9Md0rsG6eK1jNlGaVS1kjlh5YcGF+kZ0MQUFUvbIEQW6u+wIhaZCRBqA7R9NLU1uwejmJnrVps6bQuXNnCgthCxcu9PkuNwTIlpEjR4Kfnx8/75AXc88FUlBQ0OzWrVtV7CV4zf2PY2rgo46qVzkHfgW4ZXnxSjmTN4AJIY/mtCV7WQhX06yPOTUrlEq24MxuqFlDhxcTNIixmJ5mVftxivnrM4TOUMjNIO8cem+B1aJiO6I4duE2I83QIojDKmMgv0GDBnHHExQ+ZB87diw1+L/nPL2Yey6QzZs3j7GbqDRaCGw1CENYYa5eFR5aYxX4zz77bKknRg8xYH07uTRLDTNKLfhF0OsC8VEVYLx6DIJ0mJuLAsFEmJnj/sJP1TRKq9LD4IZAhPaEMI28FUbKqGJjHHfZkkhothQKH3pPlZ2dzaDYaPRB8RdZXsY9F8jcuXMfFqxWaLuMBVWw5cWYqQBrMWmXBBdArZq1YObMmSXr/C9DWrZseU2wlirKyPqgCOZmIOEwFWaB/vK/EBGGbRBBIDQU9/pt96cPqoNVpSKJKG7qXTfwn3rySfqx/g4XuX379kMpKSnKtHRhyIsdaLQG7iO4Khb3VCAYcCH79u2rLTg5xFzYv0V/zJuK+NIDA9hwars5d6alw2a+OpPGWBWv3N4j2rdvXyaD7pS1GlNACS5sK6TeYCA/E6qGBJgrM5RDZ2dbXvS5Ksmi1EJbgkpuNLel8/fagapEHTp2pHNu5X3MaPv16/cZvRX/+adfBC8O2lc0NPEGpKWllUn1s6y5pwI5efLkCNtA49zBNUEVEMRVrzgUKsj5cxG3jSJ/3ty5MGHCBOpEn8TvcO/BKoil77kU0TZ+AANF+HIQhaI/sY2zhlYngfClAAsmJum2+7WV5toAc8RTs+F8rvO36M2aN2UbNEigmzjG+/DMnz//+2PHjkXEdw+FG23XQ5Y+TdjCQyVHamoqdOrUiRPZl19+6VS43sg9FciIESNeF6xWaFsMIKVwdmqcFxVg9UEYd0Xdus89/zyJCrNWh1+IljshISH26ud3jao6FrCYrPh2GAbDDT6NBmIbxFywYGikZ7rfBqkjnVERk8Alg+Njqc2we9cehUbjRxOKmRN4UlLS4JdffvkR6g7r+0oTRgUadt6B/0Jq/g3GxBYxBr2euXbtGpY8HeDo0aP0IRs7btw42xLI67lnAsGAD7U76XRYXQjo8gSftSEKpYrN3vIFV3pQ1cpbCQwMtHrLXDooQaENloSFkjVe598+h4UEWMIM85IMyYwmroj310ga6SY4ke/+sQRVjevWrbsiOFateGZNJ4Z7pcKYIMeQAe8dGMM2G1yL9ddq2ZiYGObc2XM0Ypx54IEHFFgV7MmfoeJwzwSycOHCT+3VlYMHzcCbsnjrr51g9Af5dx80E7q34u/vnydYS49QLD2MwhsKLC5MRkzIgruqzjKOSW80QUam+928NA5LhCaYPKN3/1gksFevXvtVwSbV6K/aMxp/S6aF8QlfDNsNp37nG+RYqnK/FZl7JRBm1qxZdoeFaKKbSApyFnLp3QeCCZClmdA5hxei0WhKlMrcQROZgEEg9DZhlm/KstTiAjCRCwULFGIqz8y2nuHEGTqxbYfk4PlTnLxF9/Pzo+9b/iZ7UVFR7QEDBhzcd2RHvUc+bMGwNGulcA9G1sQcWHEFcpP4LxKxtGBee+01r40vd7lXAlHm5eWpuQY5Iv4qE7piSBdR6JITqxQKtihxExfI//vf/2iow8/cBi8EBVLqffqaJj3wr5ACGSUUnLX0smr8KOr4bYUFRjarBG/SVRKBXNMbINtJS6569eowatSoetieGFarVq0Tf27/M+G/KzsxVSO1llvDkuPcjiTYseg856b4/OKLL2hmGt6jAnNPBHL58uXhglWCEnTtHsXQFkIdS4+i2+e5wKYekGHDhpLnRG6TF4ICcfwiwBOUGlDTCF5zeCjAcPlf0YFOi7Ww0Ah5uZZULmY49rD9NjbDUOR0mMnNmzdh+fLlUXXq1PklNSNJ9+BbjbBNIWwk0H5pfypsfu+02ZdmsEdRkZumuazQ3BOBzJ49m19SSYDaIjScQlOXW6qM77HB7OnOmve4Bh69edXwWSZ9V+6VqFSqW/baVJ6ijGwIquBwwYXVm7xsRn/hAGenvgrKtXlMTGZ2ocOJtW2JoKUbzN3DACfc+1CKE90za7pAdMtqFs0iyReyYc3Lx1lDAS9Kii+sHdDS13SDN8mvInNPBPLjjz/ySpCgve8RrF6J9WgsPW6dYI2ScVcVgFIVrzKqAZ+CBYoybmBrnK/Fcc1iysYpSbIKNj/P/fZHVTxaquJrBtdVMxJH1ylxoPJTSgt4yLyZB7++dNhpiVXRKXeB6PX6hsXmvFJqQRPVCEsOhuX7+xWQueYDPqusQNSrV8/x/EMlRNukF6ZMYSQB/tefsrxC0HClgOBAUjNcf08u0gCrP5y4BI7lu+58G/tLR2g1JNosDjo8L8sA3476B/IzLCWXOCDRlyh3gezatXukbY7DxN3HSEsP+m9Kucg0sfPBjTczevTovYL1rlFVj8ZwMGHuTOUEQ93dwhYh3zAZhTA0MSV5SRij4VbF5qATXHdRNWsyKBKCwoUJ5gSKCoyw8sXiH2/SEgmC1Wcod4G8/vprowUrjzYYqtKMJWL2hKVHzqH1XG709ddfV6gA79Gjx37BetfwLwiF6FEowXg9kbcj1apiKSCO5EXSUtx/BdPEn3qf+LBmlSr2lviexQ6xHUOh9wuNBBdCGZfRBJ8/tAPSzln3aickJMD7779f6l3d95pyF8iePXtiBCvfOE/oDIpAyQslzDX1B36FXr160cc2FWrdCaxiHS+VhroujAsHEax5suILQjp/gJZe9Fkuk1WCl4Q1JW/R6TdTKEDovNJ7r9lCB4PebIZXsdwH8ftbicAW8fuJ+1Nm9umnnxoZhuG6Gn2JcheIbfWqSp+poDAZuIA2GVkma89yxpB0lnn11VdZpVL5FLdTBQETSqn02mhqN+ffBxGojaI7t3i7QEgwfQsiODAJX7lZ7INGu9B8vDTU3QzGhb3yIyRGCyMWtAWlWBvD2EExwKcP7oDzO4oNSOR6GbH0pL3L/tv8cqZcBXLz5k3riRnC4kBBY+CwyOcaoxgj+Vu/4oYotGzZkuKO5hqtMGg0mgzx+SgjsHrWEqBpig10MRvB6pX4glA8X7Wq/hhY4qkZSM9wrwQJxcZLTTWf6unoO7TOiAS653ZjYuCpHzpaCjDcMTejEL4csRP0NvP+2mZ2vki5CmTevHlW7z+0rR+kLIh30G/BHZYtKmTS09Mp4Gn0qPMWpJeBCdg6e/UQdQTNximkPWyHGC4d5hxiggwKsm40Z+W6181bQ6O0vEVHsWWZxMDnz60JVsL9T8UBN4REQKFUwKrphyHnlqWKx1mQ9h2s5rH2ScpVIEuXLuVmXhYDWXffw2gXpuZQqCD7j084a0UF6+AZ1apVu+uGqiqE/4KQSlVTQTb3BaGU8DCtZUITjMHkFPcu2Qgb6PT1ochNyTuQuC6hMOm3LphPoTjM2lTAz1P+gbRL/Pkp3khInJiwqrZpIz8MyJcpN4EUFhY2SU1NNa8voQiLtZrk2ZSdAvpTOwRXhYWNjo4WJsz1EA19qm3BRC8IbZZ3qEZrvZtDjoE8N4erR6mwesVg5oQJnQ6/XWDgzqJQK9hBr7WwFCcEljRX/k2Dm0f5l5OiODgH8tRTT7FBQUF/CU6fpdwEsmbNmgmClSN40IvmmdqJ9HUfMiaD+99VeyuxsbF3Vc1SRjUGmgeMA5NswUluIC2XQMVEGh4ueSGHMZiaYa+pXRxuPl5jEfeZLZ6aOZqfB6HxWhC/6TC/JUc2zU2EVc8fEVzW7Y2pU6fSktDUMzCY9/Fdyk0gkyZNsvRIhdcHDc23ay7LlWC8sJu3V3Dat29/VrB6hIYEIoIpVn/d8oJQJFjSBmFxH3dXlqqh8eMbdUoVC0oFS/PxDpvXGqTfdBBZSflw8vckwWUN9VrNnz9foVKpqqCz9L+B8TLKRSBnzpx5GhveWsqFyAQ/+BJmSZYCXX/1CNCEMHUqwGzfrmjRogU3gExsZ5UMJWjoG3QxK6eM45rVZ+DceSNDzTVVDncXzYlr0QKUY/4DzLjxYKoSwtR/tz74V1FjSS7cK/498tsN9psRll4z0ZA7OIQ6iisX5SEQZffu3T8S7ByayAYY+IIDE0H+P9wSG9zLwYoOtkE8f7mpDQJVtWjBQWkSjZ033boq9C5DFJF7AqEVnSJ+/AmYqc8B/Hc8qNauhY49aH0hzKsAMy7WxBgKjbD9c8snHGKGJlav5rz9LudfmShzgRw4cOB5cYmujz76CI4cT2S3T2gOiwZTVyYL+vN7oeDEnwxNPvbSSy/xOVkFJjg42OPJGzR1WoHCz1I6FN25Ldh4KKHSez5LI13BGiUlsSMWL14M3377LV6AJsDGAxn8o9Ox3eIeh5bh3bEwN8HlQ+nw5ZBdrMnAi8G2BKRG+cSJzxSv7/k4ZS0QBdbJP6AuwZ9++ol57rnnoHmTxkxCeADzcIsazOZxLZmMXcu5CImPj2diatd2rzLtxQQGBnrcSFfGYLvMZKTSFROnAgxJxT/I0/qpGI0ftRn4BMzSR+UuGDFiOKcJe/Sq8ziJAda+lgjiNx2EWGoQEyZMoEY5daX15n0qD2UqkNu3bw+i3+3btzPDhg0rFknNonTw8ZQRnL1zp06g1mgqfEtdq9XeEKwlxj+hMycQgmYw0SdaelHFBBsUqAGtv2XShSIXC+eEhoaCBhvnjogIiIV/XisEY779eho1yj///HNFQEAArZFe4T+AKillKRDF2LFj36Opetq2bSsVB2V5ZjMcczeKxKZNaUVg4KcvqcDg816xrZ64i6qKZDJukwEKrp+yzlGQgAAlqNWWaCswOG+AFNmfNdF8f7T9Tqr9z1j69evn0XP4EmUmkH///XcqLalGa43blBzkED2YyMhIiK8fD23vu48iYznvXaFxnqU7gl4Qci/y+KApSrkIkFF8ut8gbKD7Ky3Rlp3jfJhJZmYmnDt3jkoCwYdDDH/2559/hpMnrVd6okwN44/dsGGDx6Whr1AmAjl06NAL7dq1m0fVgrS0NCt1SDCLZO+evUxcXBzdS5nMTljeeFKCKCMbgPSjsYJT9sdpVq2C1SXJhA2ZbsxmQiX4vn18161UKLdu3YInnnhCcPFER0fDqdOnTS1btnwbnVyxXpkpdYFgkR2LDXOr9QZ///132xyMw56fL1C/fn1O6NIwcIUmmhbp5MODviLUX+Xff9iKLVinEQsZDlclCEGlSO/eveGPP/7gRJGcnMwuXLiQRkybRxyLv1evXmXi4+KoF+A1NHc3bMYHKHWBNG7ceD+KxOqb88GDB8Orr74quCysWLGCql80Szs7ZcpkqppYv9KtoNx///0XBKubKEHTqDuWpUJ0KFVgvGm/RzWqZhWrSlxWunsvs2kG9v79+0NUVBSEh4czU6dOZZKSrN+We/PUrveKUhUIVqd6nz9/PtQ21zMajfDOO+/AsKFDuf54qvdOmTIFHnvsMWEPmulkKUWi1y/J5Q4NGza8Ic0gXFa5tFVBRdOMItTFi/9ZcDAdaDB9LCWWvPiTJVn2oKTYlh716tWjHxkJpSqQadOmve2oWkGRsGLlSlp6ixPGJ598wgmH/MlQNWDY0EdfEnav0NSuXducNYuJzxnKOi1A4W8ZgKjPuG214CXnKRAZiftJqqY3kzwbXS/el/Q6M2bMcHmvlY1SFcjSpUu5dX3ticSeHyH137V7D30kVeHBKoy5s8HRc0vR0CI54ie2WCwYbjuuoVXVYSNdUsWiSeNKA1oirW/fvhX+RW1pU2oCSU9P7+FOYnBGbm7FH+5OaLVa9z4SF/Bv1A0TveV9hT5xs2ArTvVQraRzg4WkEsxoIoXiSowv+qVhPpGRkSu5jTJmSk0gWGV6XrByuFO18FUYhinRuxBVEK3FKOQN2FDXJ1/k7XbQ0eKd5pBlICWjdEqQgQMH0o/1lEwypSeQJUuWdLjbEsRXyM/PN1cVXWYUSi11H5GqRA8AeknogJAQ+txWOCUekpbqWQlC90UG4eY/jo2NpbRQaTM1R5SWQFTXrl2z+ljAHbH4aimDAjEPyXUZDlUjrNofQIvkOMFPK+2KZSC7BMs/S6H7kjM015SWQIziQvp3g69EGD6HVbg6ey5NQkfUBX0mTupgQJ/kfC1QGqxoBq+S4uZ7EBnPKC2BsFu2bPFoHBWVImIC0gX7xhdrwcHBbq9XSJNUK5TizC5KyD26xWkmEaim6hhvp89t8xyMwnWGWL0SnDJOKC2B0HifJ3Q6nV4a8I4iwTaCyE4iGfbIIz4RaW6veKsNAVVoNJYw5iQPxhvOl3xQqyT6QavexWhembuj1ARCvPbaa+sFq5U4HNml0IC6BQsWeDYS1stwp5uXwkEZ3RQUfpYXhEV3ksF4yzJJtV0kDXr6m+9BCSIiDy1xTakK5KGHHtpIEW9PELb+Uqj0eOGFF2hu2/8JXhWagoIC68mtHKCJaYmFhqXpZkg+T+NyOLu9sKJlQaRv0Qk3F5aygsKbTEyMeR5xGQeUqkDi4+NX//XXX2411sVIItOvTz92xIgRVHo8y2+t2OzatauDYHWKf6MuZkFQ9aro1N92MxARDfVgOd2jZEyaOLEUz+ablKpAkJQuXbq07ty58xXBbRcSBf0OGzaM64ffsHED3Qfljz5RoZ43bx731s0ViiphWFKwWLJSsleA/tpJYYt9tNRAFxWCP0WSOXRLSnBwMPSVvxh0SWkLhEj8448/xqFQrGJPFAX91qpZk75yY5ctW+aT3zifPn2a+3bWUZWSMKn8GIVKgw0JIQoYJZjSLvGNC0QMLykBWtxfMklDnif1KwFahbZRo0aVbpaSklIWAqFG6l9bt24dtXzZ8iRaysCWhYsWQVxc3Fq0tuJ9KiFVwjGxW74gNLl4QUj40wyI4jQ/2BYpMHhegtA3OsgkziHjkDIRCEIfQS175NFHIlNTU5+aPHnyTX9/fzYsLJQG2jFDhgyh3PEhNMnc3j5EVlbW/fZyf1u0CZ0wlCxrEBZJpvhxVPIEB0nHYeG13Pia0B7Ue9W9WzcauVtqS8b5KmUlECmL58+fXys9PX3ZmTPn3H6BVlHZtGkTP4+RC5TRzSTVKwUUXLPMYOJIYPy6IIJCGAb0Be6PThdFRxlUUVERo9ZoaLxY6Yx09GHKQyAcWO0aiQ1Dn5/c9aOPPnpQsDpGGwx+sda1S33iFsHmmHBuqLvgQO7ckdN3WVNuAqkM6PX6hIMHD9YSnA5R0hSjki8Ii7JSgL190m61SkpEjQDxlTsXc+lpJRuH5azTQMY+skBKkXffffdDafXIUVWJW+IAGx88LBhoeLsbM1AHB0k+uMQqVla2/AFgWSMLpBSZM2dOX8HqNLf2byz5ghD3Kji8yWrouaNjw0PFSavxMPy9kVaiDxdlPEAWSClhNBpr2U535AgVdfEi3AwmKgVrtBniTuewJ5KQavSZCZ0et1EJcse9EkSuWnmOLJBS4sCBA6MEq3OUGjTCMgS8BxidfEEoJbQ6CkQ4jA5PSeHXD3SGVBzuiFfGGlkgpYNi1qxZT0sToMPEWLUm1o8kXxCaLD1RlJjFBG17PA1UDJR+LIWkpueXKMHLo3dLjiyQUsBgMNTbtm2bW7OuaeLvx9QvNMhRCvok6yl+HAlLgwoJozaIiIlFgZRs0rjWrVvLVa0SIgukFGjXrh2/FK0baOpIFi9VKEF/3XpmdUdQ7h/opxJcKEoUSF6B+185k/BoDRaZkiEL5C4pKChoevTo0UiHVSop2hDwo29AsAHBj+DFEuSke0uN+/spoWqARSD5RSyk3bEs8M9ZXDDaZiZ3GdfIArlLvvvuu5fdEgeiDIkEhbaK4MJcXZ8PxmT31vwM1CnBT2MRCH1qm5/j/N2JrXDqx8cLNhl3kQVydzDvvPMOt8ycO2ga9aC6jrn0KLx2FIuCTHNCdia00KpaSvGCC0uuPANk57nXzUvnbdCgAasNCLC/lJSMQ2SB3AVnzpwZe+vWLUuR4ABRAJroxtgwFxvoLBivnXIqCim6QLVVbOUXGiGnBN+jd+zYkX7McwbIuIcskLugV69e8wSrW6iiGnE9Vxw0xeiJrYLDIiJH1AildyCClnDPzAz3Z3WnTw3GjBlD1mWch4zbyALxHH8qPdwtART+gaxCrbHMgYUCMaa51/4galTz56pneCbueLGB7gq6v8DAQGbLli3UHe1+t5cMhywQD8nPz2/grjg4AmvQ+nS8ncasm0r2sVMVHVaxzGUMCxnZ7qf1jIwMdvbs2bQU98eCl4ybyALxkLy8vDBRIK6qR7SfX0J7LDNMoKJqEv7X37Z8QegO3NJr5u/RGUhOsh5mYu8exPujX9q+du3ahmq12lilSpXCrl27Xpw7d26FX3a7rJEF4iFYXdG6EoaUiLiW0CMuBOKxqpRfxIDxlvM5eG0JCpZ8TYhkZ1mGmZAARDE4QtyHBlTm5ORodu3aVWfGjBlDxDUilUqlKSwsTB4ebIMsEA/BhEYp1iVxcXG0cixcWPwiLH2iCWyd3JpJfasT83rPKG67VGRklxrBm6N6WKBUH3DjVq7b4hSRntNWVGRPT0/XklBq1aqV+eqrr/6RlpbWR9hcaZEF4iEoEOuRgw5YtWoVt7KsmBLpV42hPmXiBKZ2cD1Gq7R8WSgmWtvES4TQ9+isEhM4NtRZI2TneTZhg4itGKXiuXHjRtCcOXP6REREbBC8Ki20eIpglSkJly5dehxLhx8oIVPisk3QRHx8PJw9e1ZwFefcX9fh7/eOgkqrYhVGBVPEFkFWQTocT/0XDtzcAUl5NyAl/xa379l94yGu6QSWCWiELgauXL4G4ydMZDZt2sRtLylSQdgifRZxP/p966231r3yyis0G02lQRaIh1y5cmVk3bp1lzoTyKOPPgrLly8HrOOTUxrQnEfahSz4bdJOUCixSBHerrPcDwtKUIGSUUKhoYBJyUmGFzYPAz+tziqysB3EREfHQFISL6KyQBSI+JxkAgICDJ07d744aNCg4+PHjx/O7eijyFUsD1GpVC7HeVy/cV0UB0EW0XAU5hhoaiyzOLD2xDAmOoL6u0xgYLEaxSrg4Vd7kTi4XaSo1WpITDwmuEofURyEVCjUyP/jjz8aTJgwYRj1ir399ttrU1JSBmC1M4Hb2YeQSxAPwQTRD+vovzsrQbRaLXUHC67ibJt7FC5tvo6JD1hWxQCrovwK40MyYaJaq4RhX3dj/GjSOOtSiODij4RCa86XNlKBELbPKBUNZhimatWq5SclJRVXcgVGLkE8RKPRcC8ibBORlPz8fBg3bpzgMoNpmoXkfD1s6xMEVz9qDFfmN4WrHzSCm9PrQcrj0UxO62Aw6VTce4+AADVodBq6hr3rUBctYMIUnKULJXypEbw5pM9Nduo+Tk1NDaASJTQ0NO/HH3/8Mjs7u8J/gCKXIB6Cib+VTqc7KDiL5a5S6GMnbNxCv3794PyFCzDr1VchQ2+Avi/OgkY9+oJSpWZZA9bYxNG6YpTgGY0KYMbFRrLRAfZ7lfX6QiypzGuGcji7l7vFUYYgvaZ0HyzZKnQmLAvEQ/R6fUOsQp2ghEEJoiSJUpqAGJUf0/rRYWy7YY9DROOmYCgooNSGGyyni0JxPF0vUnBZs/jbb+A/4/4ruHi8RSCiH5a2xjZt2lwfMWLEwcmTJz9KfhUFWSAegjljDEb8JXcFIt3H1k6/IprgYHjgmanQ4QlK9CwYUTCsQsE0qRrIPlirOmgkwjl+Jwd+u5nBpF+/BkfXrGT//nIh484EdKWN+Dy2zyIiDSNMb07DyduQBeI5Oqw6ZQn2Usu1xUSm0QVD83YdmKGvv8tm1AgHdX4e1yMWXyUA/JUK5nxOPuQairg2CDf4EX8xBcKlQ/8wa15/GTJRNNKEW1r35wqpSGyvKb0PatSPHDbs6A9Ll3r1EhiyQO4CapBS49STBOjoGGkCW18nmukTEsxiCxmyg6vBvo7dYe/wMaDSapnC3Fxq2xSLPJIKCUahUkFuRjqc2PQ7/Pnxu6DPcT2HVlkifS4p3t5GkXux7oIaNWp4vIq/K3G00WigJ4mDfBgF6LKzYOf/FjGz2zdm/vfYQ5Bx/Qqo/LX2qyxYmpiwqqWtEgRtHh0JM/edhAmrNkHNZs2FHaxxlHjLEnp+MjT2iwxlNtOmTdsubPYa5BLkLli5cuXXw4cP/w/ZS6MEkSbUM40SoI5GzS3cSOzJzYNOZ84Xu4Y2NBR6TnqBbTHoEVDpAsGo12Oty36+hxcEhVIJhsIC2P7lIji0cinkZ2TYvZfSRvps0mvZitPbShRZIHdBfn5+G51Ox63SdLcJTJpQaA3p7JbNKEVzbtrwyNmLzNq8PIcJWYklTkL3XtBh9FiIva8DiqAQWCxFsAEi7GGB4pyEQkI6t/Nv2Pfjt3B+1zZha/lgKwwp9Iy0vU+fPuc3bNhQX/C+J8gCuTtUWD3ghpyURg4sJpqFNcPhmbDqXKOcPAowjqoc5dfbFBOP7fVEP/FXo9XC/WMnQouHhkJo7RjQ52Ej345YqL1C1yDBkH3vkm/h4K8/Qdr5kn3Q5Qni8xLS55H63+sSRRbIXYBhF6RSqe6Q3TbBeoKYMDKaN4Yq1DuFsJjL/5SaCmOu8QsCS0XAeQiIfsW2YcKPbdcB2gx9HFoMehiKCvK59gm1U+yC6UGp1sD1Y4fhwIof4fCq8pvnQSoMKeQfHh6es27duu9btmw5VfAuF2SB3AX79u2b0aFDh3ftJVhP6Yk5/6aEepTbcxFzQW+AFifPQG4pnV+J52824CEYMOMN8A8K5koWemPPdRfbIFbFqMfs3M5t8PvsWZCfaZlaS5qgS+v57YlEFD7Zy7tEkQVyF2i1WkNBQYGqtARCC2afbNIQwlVY3eEShAK6nTkHu/Ix1y+lBGhLaN14uG/kaOjw+H+4NomB3rdQdcsGSiekIUapgsyb1+HQql9g7/dfsUY9P6i5LAQiCkMWSAXEYDDE+fv7n5VGorDJY54NDYGFtaMxNZro7TlrxATrf5gfzl5aCdARGp0O6nXoAgNmzoaQWtFQkJ1FiZWKFmEPCZRm0Jt+Lh/YB7+/PQvSLru3xom72ArDlv/7v/9Lnj17Ns2oX6bf0csC8ZBly5Z9OmLEiIlkLy2BFDRvAmo8C52IVarYeTeT4OVbt+76vJ4QXCsGGvfuB72ee5mrZhkNBvuNfIRFQStVGsjNSIONH86BExvXgRFLvdJCKhJRNPQpQUpKyjP4+6WwqUyQBeIhNAMITXIgRtjdCqSBRgMnGzVAG9+1m80A2/DYKebmPRhbJYXaLK0eHgntRzwO4Q0agb4Aq2B0i/baLPSeRaXiipbj639j9/30A9w4frjUBG5bmnzw/gdZ06ZPqyo4ywRZIB5QVFRUx8/P76IoirsVCH0Ktat+HLQJ4BfIoRgZfeky/JR5b4eH2EMbEgIPPDsdmmJDPyA4GAwF+VjCWGadF8HAYEkojFrNGLA02fr5fDi2ZhXkpCQJe3iGVCQNGzaExMTEMm2TyALxgMWLF3/9H+RuSw2R/jotrIuPp0yZjwxMV9T2cG/u9rJDmhhtn5V7MflAb7jvsSchvkNnrnFvIkEIJQsnEAT/cFbqACAhnd25Ff75ZQmc2/Ynt19Jkd4TZlJMXl5eqcSBI2SBeEDt2rXv0NQ4pSWQ1KYNIQTr+VhX42JjTXo68/Dl6/zGCgI18js8MQ66TZgKaj8/MOTlsqBUFg8ffECuzaJWg6moCHYvXQztVAZo1749XLhwAb7//ns4evSosHNxbEWL6VcWiDeRn5/fQqfT/Uv20hBIKJqUls0x1QhtDaWC7XTyNLMnv2zLD2lCKwm2zyyeR/SnNkt0s5Yw6PV3ISI+gXuHwlAhoigeVCYTCxMbREG4Ro2i4W8Hz8N9eUmTbTtCes2yFki59in7Ali9mka/pSEO4qs60Zg4eHFQrCdho7ysxUHQ/XtihMMdQr1Xl//ZA5/07woz4yNgbo/2sPbtWWA06EGjDeCFgIba+cNjwyHCT0PVMnHyOvpOBDZt2sTOmDGD8+PPao0791FayCVICaEJCe7cueNfGpHUDOvx+xvVB42QEDAqmPdv3oL/S0rhtpcljhKfKzx9bmqzVK8bDw++8S5Et2gFIViiTIyvSTm09D7EcxclJydfjIqKiqPvbQQ/K+j+6V7KugSRBVIyNGq1Ot9RpJWU4w3ioYG/H9aqMLFiZP+bVwDtzp4HTzt2PU30pUFJhfPCCy/Ahx9+SFa6Z/G+6RxkKAiONm3aNOrkyZM16NyiIGgngtxY8tBk3GUqELmKVQLS09M7e5qD2kJdu42wvi4O6qAUMjfptsfiIOjeSmqEQ13i6XFSKFGLIsYSwtzusANTWFgYi6Z4/7GE2JgYwVZ2yAIpAcePH+/kaeKwZXZ4GKU6wQVQiGllmRe89wgODoYGDRoyXbt2ZTAHZ9DNYLWSiYuPg/bt2kPPXj1hwMCB7IABA0yNGzdmNVh1KkmYiPvSlKyJp46SQoqphKpNS5cuDb506VKIo3OT/7NTpzpUWGkhV7FKwLPPPrvj008/7Sw4PaYrlhxbsXrFCB9EgVLFPnfxCrMww7NFaNu1aycOvYCcvDzISEujQX00NRH3awsmeOjWtSt06NgRunfvrq8dXTu/SlAVvVKpzMUcnj4jzsJ0kYQ1GLqhcDS0fjQVeinofxP9d+Lv1VWrVj2GPEhzBOM2l0irSWOXdYTgMC37XtffQa2gU9On9Hx74q233mLfeOMNp+ds1+4+duvWbYaAAAcThpUSskBKAOaotxMTEynBWEV2SdlQNwb6BFUxt0ivFRVBs8TTkCm4SwLl+ElJSfRN92p03sB7qoVGjYa6pE0FBQW6rKys6iiWQNyOOb6fqU6dmFQ/P7/N6D6MZi0aj6A1RGiZhJKGQ2yHUPahOc3o1SHrp9TCf5rMhvDAGDh/8gqVHPDRRx9xidLZef/880+2Z8+eQ9C6hvcpG2SBuAmGUzV/f/9kTGjFx4KXAJq4Nsvmc9o+Zy7AFjcG94n1d2nCEXPd8ubChQtjGjRo8K14L84SszQz6TI5Dto8GkPjuTAEqBcK4Mr+dPht5lG+aS7gKAMq7+eV2yBugsKIKI3eq2EhwWAUq1YI2dwRhxRRKE2aNeHc5Q3m3u80a9bsf+6IgxC3a3RKaDs0hhvUSOIgP4VKAWtf48VBzyUaV+csL2SBuMmGDRv+e7eRlqBRwie1a1l6rrCS8WVymuByjigKEZ1OB4u/W2zlVx5g43pR//79Z+Tl5VE1zu0erZrNdDBpXRcwGS2Zg0KhhK+G7gSj8F5UPN/dhnNpIgvETaZOnfqkYPWYydWrg1YcJo4JPs9khI+Sknm3E6TiEBPQ2LFj2ZYtW/4teJcLZ8+eHTty5MiJnpSkD7/fiq9PClAwnNt9G3KSXI8aEJ+fMoXyRm6DuAlNbnY3ORuVGnpse4g9V1iPYMdfusJ8neG6aW4rEOqxysq8w6rUmurolc5vKVuwod8pNjZ2M30DY3s/gtUu2AaHJ75ox1aNDuCGZHHg0X8tOA3H1ri3MhZdj66zbds26Natm8dx4AlyCeIGBoOhvpgQpImjJHTBRC02zAkUCvNLCcVBUCOVhnijOCjuykUceM2qYWFhf9MQm5KIgxg8uzlUra0zi4OCQJ9vdCkOuo5oyB0ZGQldu3Yt9yHOskDcICcnp5Zg9Zif6sVIM1DYeCcbSvJakBKjOwmyLNizZ88kT6pVHZ+uA7Vb0eI+QsaAD34jMQM+fXAH73aAKArxmRskJMDevXtpaMkYbodyRBZIOUA153A1t4QaB/Vmzr3tuu0hRZpzlzcTJkyYTL+iQN0Ra8P+4dBhTD2urUHvO8iPeqx+nXHEqjvXFtvnpBLzxMmTipiYGEqrW3nf8kMWiBuoVKoCweoRX0TXxIgW2h5o5iclwbYSvPcgKEHWr1/+s3DidSNowCDZ3RVpaLwO+r3UCExF/DNTl26R3gRfj94DRhePLYqPTNOmTd26XlkiC8QNMGF4vGr/8GAdjKweZq5e0aenr9wq+XB2emP+888/l3uC6d69+x7B6hath9eCJ79phxmC4IG/GH7w2aDtkHnF/fc9DRs2gCNHjsgC8XWmhUeASfwgCnPgRCw5nNQwOCints2tR40aRd26OwVnuUBfT2L7gxsySzm69NceSqxFdp2YAEYsOSzVKiVs/+KM+V2HOyRgm2P9+t9NGAYPC173DLmb1w2oixNz8BInzppKJVxv1hiVwVc19Jjo2ySeZhKF2QgdYSsO+u4hOzvbqNVq66LzKu9b9owbN27vt99+245EId6TM4FM2dQVRWLJc/EgWDL+H0g5bd0dQedydB5qcwhWr0AuQdwABRIhWEvEuGpVURtC6YFmw51McCUOW2iqzaKiInr3Qd9GlJs4CBKHYHVJm1HRoFBbkhM9761TGcXEIUIikRrya9WqlVXG4A3IAnGDCxcuYDFQMtprNTCrVhTNc8tiamCp7fHUxStOc0dpYiGc5dZlzVdffbVYsJpzfEf38+iCFtD56Tiux4oDn2Dfj5fg5wnc3BZWSJ+PEM/btm1bOHDgQJHg7TXIAnGDX3/9tbttxLpieng4KCUvBpOMBo+Gs98L6MXg5MmTRzkThUhIjBZqN6e5WQQwlOgTlH3fXBY8eGzFL6V9h/awZs0a2h4neHkNskBco1y1alVLwe4WtELUkBCaq52HUsXTF60TjDu0an1vFoB95513fpC+GHQkkiaDwuE/Szqau7CJtGt58OkA91arovNSm2Pvnr1MZGQkXa9cq5DuIDfSXVBQUNA0MDDwqKucVMrIYB38GFvH3LWLrVVQHz7mtPdKmrvStehTVhQmO3DgwPLOxLT0ZSFZ6D7ovuw+uxLgha3dgZpY5vGXSiV8NmQb5KdZP6ltySGej56xsLDQ7XC9F8gliAvatWtHX965TR1MJF/UqW0ZVoLiWJya6rJr15YvvviCxHFEcJYbx48f5xYldYYuXMMNXaeCQxQHtbF+nryvmDgc0aZNG7h06ZLX586yQJyQlJQ0kD6xLUnpMaF6NaiCiUXEgKloXkq6w4RAuauYw9J1yERFRbFjxoyh7p8Hyb8cUU6YMOFFsojPbO/Zh89vBRp/yYeVePepl3Pg9vE8q+e092xk1Go1u27dOn3NmjUf53b0YuQqlhO6du16cdeuXXXsJRJ78EPam2CgogUTBv08d+Ua80ma48kYpNUPus69fA9w4sSJZ5o1a/aps+cd/G4TiG0XZtVj9e/qa7B9YfFFP22fjX7v5fN5giwQBxgMhnh/f/8zZHdXIM+HhsAH0VGcUDDr5N6fa/495vRYaSKKiIhgbty4cU8SEKaDagEBAUn0zb2j5x2/uhNog9QWcSA3Eu/A8sk094MF6TOJ0Dnj4+Ppo6t78nyeIlexHPD6668vokglYy/CbaERu1PDa5g/pyV257i3Oph4nQ8//PCe5VZLlix535k46vcMA22wtTiykvJh9Sv8EnEEhZNtWInPFhMTQ125hYJ3hUEuQeyjxHqyXuzqpEh3lHBEFkfXhNHVq2NWzHd53mGBbZx4irnl5gpRnTp1gp07d5Kiyv+7UnxePz+/Qnpee8/Zd1YDaNgzkqtOEZRkcD9Y2HM77yHgqOQICQmBW7dusXiN7uhlfZCXI5cgdliwYMFSilgxwl2Jg3g0tBpg7Zrbn/78nJLiVBzSxBQUFMTOmzuP3KN4n/IF21rnxMzAFm2oEhr3ijKLg6ClCn975YhdQRAUXqKhNkd6ejqD4qDzVyhxEHIJIiE/P7/5Aw88sHbfvn213Sk1RAbptLC6Xj1glJhg6BhGAQFHE9kCO8fbJqryXtbYlkuXLj0eFxf3g91n5d519MBC0fIikAYgfv7Q35CfwYtfDCfpc4nnqlWrFly7ds2tMPRW5BJE4N13311do0aN/Ug0ud0VB7U5pkdGmuvmlErOFBTc8+XT3AVLj0WCtRh9Zza0mqaH3nWc2HjDLA7CVhwisbGxsHHjxgqf+1Z6gdC7jtGjRx+cNWvWgzk5ORp3hSEyIyQYOlWpwjvwWBpt98SFy24L7F6yaNGinxwtJff0io7QoFuEVaN8/ZtHYNO7pwUXj23JQaZ5s6Zw9ux5mtza5UtHb6cyV7HUM2bM+H3u3Lk9BbcZV4mbpt356quvoFnz5lA3ORl0K5cDu3cX99Z8c04e2+/8RfPxYhVEtHOeAvHx8czp06edXquswHuKVKvVNJdvsevHdgqBh95qAQoG751mQMS7Lsgwsp8/sqPYvrYCoTaH4PQNSCCVzZw6dWrc4MGDEzFyqf5AXZP09ZrZkJ8jg/V1FtsNeBob/v2XNTZvxIZJjpeeT3p+0fz2228mPNLuPZa1Wbx48f/oHsR7FU2PF+LZF7b3YJ/f1p2dtq2H6bmt3dkBsxuzCnXx57I9fvDgQffsecrKVKYSRJment6tb9++3x86dChK8ONwVWJI2bFjB3TubH8FhJQFC6DGc88JruIlhhS6ZmZmpjEoKMjpIjFlAcZ5FY1Gc8e250oTrITJ67pZtzuUCljQ8y/zJ7O2zySGHS2pcPnyZb1OpyvT5QjKm0rRBsFIjBw1atT+yMjITQcOHKDlATyqBox6bKRDcRCBY8cKNteMnzCeune5NcjKm9mzZ/9EYSBN7DVbBMOkNTZz56I4vnrEMneuPegc06ZPh5s3b7AoDlpHxKfw6RIkOzu7w7Rp0z787rvv2om5pb1c3V3BvLVkC7z6eA/BVRyDwcAN4XZVctAHQps2bspBgQShV7lGQF5eXmvM7ffZvjWfTN+TqxXmRjn1WJ3ZcRt+f+2E0zDD9ONRZlNR8MkSBCOt2q+//rqgWrVqu7755pv2Ym4pjWjyE43g5RBlXEcIm/k37MsNtZeaOS/KaNLS0lyKgxIUfSCE2qCuL4f7lhGamJiYHVJxaLRKeOrHdqDSWMRBN7VxbiInDsJROC3+4Yfyvv9yx+cEkpqa2rdLly6Hhg4dOtnR22H3UYLuoVeh2sj3qL4B/1zLgdkbL4LJOllwCacIS48hD9OCR8URE9jEiRPvaYLChvlnGD4BgpNj4vouEFzT4kUvAo//fgNO/p7EuUXB068okpCQEIbWMn9i9OivyO3L+FQV6/jx45NatWq1UIxI+pVGrNTuDiGTfmRV1WKs9jdheJ17pR1U1aoFH6qOMPDUU0/B999/z7mlpYh4vfCwMLh2/bpJrdFIxzOWG3fu3OmKVatt0jDpNL4utBkeY3nXgXd95XA6/PqSZUEbYQsHHePrVSpbfEYgf/zxx3sDBw58SUwAgrc5gZYEZaOeUPXhV+k9gOAjoFRB5sZPQL/vJ5ptnI2pE8PcuHkLkm7d4hbMFBOeeH3x2tQuSUlJYbFaRa3478ivvFGr1UYqUcV7G/FlK6ZGnGWdREoGuamF8M2IfQ4zlIYNG8LJkydLHJ4VGZ+oYn3++ec/kjgEpxlPxAGhdaDa0LcwYKSHYupBcaR/9wwnDiIpKQn27d0H165c4cThjOnTp1OP1Qq08kVMOfPOO++sEcOCfsMb6CA8nheHOANiUaERlr9wkKx2IZFv3lyir499gopegvi9/PLL6z/44IOeYs5IeCQMJOTZ5aAKiRRcAhg++qtHIfMX1J/eMres9HqOoBkRMdf26F5KiyNHjkxt27btR2KY+AUzzMQ1kncd+BT0rmN+z22sycDvY/tsAwcOYL7/frEJ2x7T0fkx71s5qNACGTBgwKmNGzcmUOTfrUB0I94HbVwHStWCD09RTjpkfExTxFoPXRev5+hatFzYJ598wj755JP3rJTOzc29D0uufWL40Ny5wz9tzYTF6vA5+X1IHH8tPAXHf71tfh7aV/y916ON7zUV9uE//fTTpSQOwclFrGgEL7dQhidA6IsbbcSBaYWqVN9MQHEMRreRE4TU8PsVhyYkeHjIEDYjI6MIxfG64F3uXL58+bE6deqYJ6iicHl2XXcgcdAYK/Kjdx2L/7MHjq68aRa69NmUynvSn+BVVEiBYENxwpQpU0YKTreqO3bRBkO1/34DCr8A65JDgY3xNXOAvX3KLAipAMXERIjbAwMD2YceGsxie0Sx6tdfFSqVirq5ZvN7lS8ozgfi4+OX0HqC5Kb7a/d4DLBKLBWEAYgMRv2NkxmQcbGwmOjF55s5cybnrsxUuCpWcnLygOjo6DX0skuMVGmCdRfd4/NBW7cN330joSgzCTIWDkcbX2rwvsWvERcfB8OHDYfhw4ezsbGxrC5QdxSrLbTq7Av8HveGq1evDm/cuPEPtEyz4AVDFzZnajauytmpUW5iTcyeJRfhn++u8H6S5yToWbdv3w5dunRZhc5Hed/KSYUSCEZcGObUNwsKClQUqZ4Ig9D2mAi6DlgASY/GcMg/uxdyVr2K2uB7pewJhKodL774Irzx+uvpfv7+f6CX18ztRCVHRETEZukL0pA6fsyYbztiRHMvyLnVnmj9jkV9dlp159IvUdnbHLZUKIEMGzbsyKpVq5pRxHokEG0ItjfWUR6KDsmhCgVkrnoL9ImbBA/7LFy4kJ08ebJXJqCkpKRB2Ob4Vcw8yK/5w5HQY0oDxmjkF7ShkoMGIM7v9RewRdalBkHhiemhZGHq41QYgWCVKiE4ODiRqlYlFgYS/OTnoIluijbJ8+KzF6XfgIwfpgDk8MuiiYlLvAb1///2229sjx49sv38/H5Er0nkfy85ePDgtM8++2zYxo0bG2Jbx5Sbm6uhJZrFe6ZnCG8SwIxc0Fb6tKDPM8Lip/dBzi3rElI8btDAgezadevkEkRCRRFIQMOGDS+fPXu2uifi0PZ9HnRthuDTSg7FxzYZDZD2QV9zlcoWWtDl0KFDXpVgMINogNXME9JqFCEmdkJXUwNPfH0fo/az9ELRoy+deABSTudZlbx0HLlp3qq///67EEshf2GTDFIhcos333xzuUfi0IVB2Gt7bMSB6YhRQPqKmZD27gMOxYFVKUBxeF3usXfv3uFiOFDilpYCZBg/EzPup/sZlWTIF826vmX+aUg6aVntSXostavoWVEcjsfyV1K8XiDp6ek93n777X6C032UGgidshz1UGRdcqB/zs4fwHjGspi9mFjEBPP+++/D/PnzaXkk83sWb+Hjjz8eSr/ivVplGqiJB2c355ZfpkemdgdVEA4tv8oeW32L28U2kxGXeAsNDaW0sJv3lRHx9ipWgFqtzhZzR8HPJdqBr4Cu9UBKDYIPgs9pKiqAtLmoNWFCN9tERm5v7sXJy8trVaVKFasBU9JweWZtJ/DT8dODco1yBpjrR9NgxVTrVRTE5ybkXivneHPgqB944IFjJREGoWn1EOha9S8mDn3SeUhbMNyhOIhhw+n9h3dCE7w1aNBgq3i/9Cu9d/rwKbCapflA3bl3rufArzPKfYkRn8IrSxC8p6BevXod2rZtWz1yuyUSjRZCX9qIisddrapUKsjZ/Dnk7/nBKue0PeeXX34J//3vfy+ilbumN7F27doPH3nkkedsG+YiQ4YMgSZNmlA7AkwtL0LDHlFQZCiCT/pst1tK0q+IXIK4gATibWbixIk7MSKLTSvj0IREsyHPr2HDZu1gw17daTFv7GGVddpw+4jnsz0vNlDZadNeoJ4cA147wPZe7rX57LPPflSpVEZHYbF//37cjaX7536xzcY+u6Y7G90mhNtu+7yiWzR4iN3ryoY3XleCfPHFF0smTZpknsTZVemhaTccgns/K7gE6JkUCkh5ry+Anu+5wcRg9aB03po1a8K9Wo/DHejlH97jGsHJIYYH9Tz9+eef0L07TZhuTX5hPnTp1IXelwg+Figc6BziL8a/1z6/N+BVxevRo0enkDhciUJEN/RtCO4zRXAJoDiK8rMg5dPRZnEQdE7RkLtLp06we/duSUPF+5gzZ850aVhI7b1794Zu3boJLmu0flp44403ODHYyxjEX9ttMsXxGoFge+PNNm3afOwoQVgRVhdCX/wdtAldUBCSNI7tjfwTWyDjw4EAaZfMCUSaECjnffnll2H7zp1FderUKZ79ehFxdeO41/sUDrZh8fjjj2NTy37wEM7m75JxH6+oYtFXb61btzaLgxK0I3FoOz0Fuu42cyLjM9Deae/3wVLD8tWfLQ0aNKBpRx2nKi8DG+VN/Pz87Pbk0VD0t99+W3AV5/Tp09C4cWO74SjNMORGunPueeBkZmZ2JnEITg5H4tCNnAe6B54WXAJUpcpJg7RFj3HikJYaYkKg35EjR7K7du0ycMdUELBxnhgeHp4jPoeUZcuW0XomgssayvSWL1/uuASWcZt7WoJgBIbXrl377K1bt2gSNScRqoTQlzaAAuvWeMu8F0FVqgOrIef39wUP69yRwATGfPPNN2y/fv3+QSe15g9xGyoImMM38vf3P26vi5e+STl39pzg4qH4nDFjBnzwwQeCT3GkYSSXIM65Z4GDYojExHtRXJ/CoTi0IRAy/rvi4qAh6r/NthIHIT1XlSpVmJs3bzIoDnrODmgqlDgIbDOdRIGvl5aG3Abk/Lnz0L9/f3NJkpOTA++9957b4pBxzb0qQZiWLVveOHbsWIRDYSDKhK5Qbfg7XDXKDDbKua/+fpiM9TPr2f+k5xo8+EF25cpVLFZTfOHDan9si+RQKSI+o21CdxaOUmyPk0sQ55R74KAgqw4ZMgS1cSyC3I5yNG3PZ6HaiDk24kC7yQQZnz3OiUMqDGkCmT9/Prtq5aozKI6WgldFp+Dq1avcuyF7mQFB/o7CUoptWMk4p7xLkMBhw4btpq8CyWE3onShEDJmEahCovDuJJsZrFKtmAX6U/xEHdLEIJ6nd5/e7KaNm3w2R8zKyvq+bt26j2VkZKjome2FgbvYiom6v7EtOCM0NNRx/awSUp6JiXnsscd2iuKwCw1Rn0yTt9mIA8nZ87NZHPZo06YNrF2zlpYI9FmCgoKeun379uBmzZqZe+NIGCUVB2F7jMFgYLA985bglBEolxIEI6P69OnTly9YsMD86tc2grT9poPuviG0QfBB8N5MRj3cWfwcGG8mCp7W0ARthw8fYePi6lEDfDwa+o7D1+mMmc3Py5YtqymGI5UIngjFtiSR2yTWlLlA8PwhUVFRV5KSknQUgfYiUtO8PwQ/+IrgEqA35FiipHzQHyA/g/MSI1M8vlXLlnDo339LnCh8hJrNmzW/mngikWu4SxN6SYQiC8Q5ZRoYVB2IjY29SOIgt21kcFWqmdsgeNAMwUMA98rZsRhS3uxkFgdBEU+GVpldtGgRi+LIEzZVRm4ePXa0w5CHhySJmY4ojGLh7ASpmKR2GZ4yKUFoBpIDBw482q1bt7ekEWdLyNTfQFUl1Lq9oVBB/tldkPPzi7xTiGzxHP7+/uyePXugRYsWfzMM0xe9nE+t7vvU6tOnz+4tW7ZEk8OTRC4NY0wPskgklJZANHgevzt37rQZM2bMooMHD0aLpYaINOI0bR6B4P4v8NUoEbKjOFLeo/FU1pML0C8dj20YmDJlihyBxQldv379jsGDBzf0RCCEGM5yFcsadwWiTU9P75iVlRV+/fr1uqtXr+6OJUTsjRs3gmmYCM1VRTtR5JCxzfXNaLQQPHIePz+VTS9V5p+fg37fMrRZz6JOhISEwPHjx9ioqFpb0Nmb95Wx5cKFC2/Xr1///8Rwp3goiWDEeCM0SiWkZmT8NzAw8GvBq1LiSiAaDPQRzZo1+5pm7CMPewEuDVgptvuGvLAOVIHBaJN4Y0TkJ/4FOStfFTysI1Yu8kvGN998s/Xpp5/mhvE7zKicID1myJAhBb/++is3AXZlxVlxqp4xY8Z6zJG+p4mQKcDcDWj6Uo8W3Mf9KYFzyyOfvZ2N5ZCNOJCUOT2sxEGI1xnhxZMoeCtjx44dMGjQoEvSTMZRBuaKNWvW+AnWygslYHvm0KFDz2PAUiOBApcztm5H5urVqxQ5eBoL5Pr54C02+P928N+Ov7GPhdAYbn86r+25J02axBoM+ut4mN37k41jg+2IujqdrlAMS3fjTTRifJCxd/7KZOx6kmnfvv0VaUCRsReYtmb06NEkDgpYa4Ug5PHx31dY3UOzWKxamY+Rnp8mUZgzZw7tXogmBI3d+5ONc5OTk/OkNHxFuztGGh+2561sxq4nmdjY2HTbwJIGoNQtNdiAx8M5igmESDx3xe5xokGK3YtsPDPzFyxYI8af1NgLd1sj3Zd+sW3zG57T3/Yavm4ctkEaNWp0m37FeqwUe34iNPTDARTwoGGp5OfBgKfA5/yJ1157TbDJlAZTp0x57JGHH04WnGbEcJeGvS1iHNM+ZB83btzgZ555xjJfayXBoUDuv/9+60/V3ISWCiblIbYi4nrM/vmHPuzjoYAXI2LixIkwa9asLG6DTGmRu2z58jZVq1YtIIe9jM2ZSGz56quv2gjWyoO0OJGaFStWfEqbyWAgulUsi6awsKBYI504cOAA18aw3Z8WvUSy0bRHY/d+ZOO5MRgMHSIjI2mkMxfeFJ+2RhoftvtJ7fbO78vGrieZI0eOvOAo4FyZfv36sZmZmZxIjEYj96svLGTDwsKK7Wt7XdmUjcE4aIjV5jxpoicjukti1Gi2bt16C8/LTR/vy8ZhFathw4Z/0i8GCAVkifjjjz8gODiYvl+AunXrQmBgIGj8/CAlhV/FSaRFixaCTaasYRjm1IkTJ1qkp6d/I2RUHmPAqlpycnI4WrmvQn0ZhwLRaDSXaXkvxGGD3BU0icCVK1fsTk9DLxOxyuXTHzh5IWcx4xp3+/bt7tu2bfsnMjLKo/ilTBOh4+ryPj6MtDixNd27dz9Pu5S2QfGxq1auxEuwr0qvJ5tyNRoUR9e2bdoY1Wq13SqXNM6k2+Pq1TNdunSZ2iM1bM7pc8aup2hoZnF7gXQ3xvYasrnnpikK5VNsM+7ZuHFjapcuXYxYNXYoEptjfd44HayYmJg4qXnz5p/cTTXLFrxeqZ1LpkyILywsfPvgwYP3bfnrr8i0lBQNeYbVqAH9+vXLb9OmTSC3VyXBqUBSU1MHhIeHrystgWDjELBxJwukYkCzXVIboyEaevt7Hc01NCfQVBqcCqSgoKB1YGDgAbkEkamsOBvuDn5+ftewHupYQW5Ax4uG3AzD0MtCU48ePWhaRFksMl6NU4FgYrZ+cXEX2JZCodWr18CfsbxLRsY7cSoQxJzzE56UJiQMURx1Y2PZ6dOns9nZ2UnLly37A72slheTkfE2XH1yS9WsIvGbcxKIp+2R5s2bw969e01ardYXJpOWqSS4KkHuCrHE+eKLL+Dff/89heLoxG2QkakglHkJIvdayVRkXJYgJRUEiUg0zZs1FXxlZCompVrFEqtUBAlr9Zq1gktGpmJSZm2QuLg4qFOnzhnBKSNTISkTgQQEBDC//PwLlSaTeR8ZmYqJy0Y6vfUW2yHOGuniNrlRLuNLlEoJIrY9pG0QGRlfwJVA3Jp6kkoO0QheMjI+gVOBYHUpQLC6RUhIqGCTkfENXAmE+1jGXTp37ijYZGR8A1dVLG7JA3eZPfsduQ0i41O4EojbCZ7W2W7YsMEdwSkj4xM4FYhCoaAJrN2i7X1tQa1WV7q5W2V8G1clSAHNjSXYnTL4wYeotKFZUGRkfAZXAoHhw4cfFqx2Ed99dOjQnn7W0x8ZGV/B5Zv0y5cvP1mvXr1v6R2H+LZc2MQhvzmX8WVcCgQFEYNti0uOXgLKApHxZVxWsbDUuNK/f/8b8jASmcqIS4EQK1euHGFPIORHgxlpKp+hQ4dSYz6W3yIj4xu4JRA/P7/dvXv3Pis47XLhwgX6kb85l/Ep3BII8fbs2V9TiSGWJNIShex37mSS1fenw5epVLgtkKbNmm0mIThqrKelpdJPVc4hI+MjuC0QlUp1IiYmpvhKOAJGo5F+SjT6V0bG23FbIIgpMTHxIWk1S0pBQQF9DxIkOGVkfIKSCAT8/f23jB83/hDZpVUtsuM2Eo5W8JKR8QlKJBDio/kfPS9YrRgwYAD9XOEcMjI+QokFgiXFrmnTpllN5zN06FB26dKlWWiltdVlZHwGl0NNHBCSkJCQHBUVpdi6das8GbWMz+KpQIh2eOwEhmGeEtwyMj7H3QhERsbnKXEbREamMiELREbGCbJAZGScIAtERsYJskBkZJwgC0RGxgmyQGRknCALREbGCbJAZGQcAvD/wQPCV/+TBd0AAAAASUVORK5CYII=";

/**
 * Formatter which is used for translating.
 * When it was loaded as a module, 'formatMessage' will be replaced which is used in the runtime.
 * @type {Function}
 */
let formatMessage = require("format-message");

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL =
  "https://champierre.github.io/posenet2scratch/posenet2scratch.mjs";

const Message = {
  x: {
    en: " x",
    hi: " x",
  },
  y: {
    en: " y",
    hi: " y",
  },
  peopleCount: {
    en: "people count",
    hi: "लोगों की संख्या",
  },
  nose: {
    en: "nose",
    hi: "नाक",
  },
  leftEye: {
    en: "left eye",
    hi: "बाईं आँख",
  },
  rightEye: {
    en: "right eye",
    hi: "दाईं आँख",
  },
  leftEar: {
    en: "left ear",
    hi: "बायां कान",
  },
  rightEar: {
    en: "right ear",
    hi: "दायां कान",
  },
  leftShoulder: {
    en: "left shoulder",
    hi: "बायां कंधा",
  },
  rightShoulder: {
    en: "right shoulder",
    hi: "दायां कंधा",
  },
  leftElbow: {
    en: "left elbow",
    hi: "बायां कुहनी",
  },
  rightElbow: {
    en: "right elbow",
    hi: "दायां कुहनी",
  },
  leftWrist: {
    en: "left wrist",
    hi: "बाईं कलाई",
  },
  rightWrist: {
    en: "right wrist",
    hi: "दाईं कलाई",
  },
  leftHip: {
    en: "left hip",
    hi: "बायां कूल्हा",
  },
  rightHip: {
    en: "right hip",
    hi: "दायां कूल्हा",
  },
  leftKnee: {
    en: "left knee",
    hi: "बायां घुटना",
  },
  rightKnee: {
    en: "right knee",
    hi: "दायां घुटना",
  },
  leftAnkle: {
    en: "left ankle",
    hi: "बाईं टखने",
  },
  rightAnkle: {
    en: "right ankle",
    hi: "दाईं टखने",
  },
  getX: {
    en: "[PART] x of person no. [PERSON_NUMBER]",
    hi: "व्यक्ति संख्या [PERSON_NUMBER] का [PART] x",
  },
  getY: {
    en: "[PART] y of person no. [PERSON_NUMBER]",
    hi: "व्यक्ति संख्या [PERSON_NUMBER] का [PART] y",
  },
  videoToggle: {
    en: "turn video [VIDEO_STATE]",
    hi: "वीडियो [VIDEO_STATE] करें",
  },
  on: {
    en: "on",
    hi: "चालू",
  },
  off: {
    en: "off",
    hi: "बंद",
  },
  video_on_flipped: {
    en: "on flipped",
    hi: "फ्लिप पर",
  },
};
const AvailableLocales = ["en", "hi"];

class Scratch3Posenet2ScratchBlocks {
  /**
   * @return {string} - the name of this extension.
   */
  get EXTENSION_NAME() {
    return "PoseNet2Scratch";
  }

  /**
   * @return {string} - the ID of this extension.
   */
  get EXTENSION_ID() {
    return "posenet2scratch";
  }

  /**
   * URL to get this extension.
   * @type {string}
   */
  static get extensionURL() {
    return extensionURL;
  }

  /**
   * Set URL to get this extension.
   * extensionURL will be reset when the module is loaded from the web.
   * @param {string} url - URL
   */
  static set extensionURL(url) {
    extensionURL = url;
  }

  get PERSON_NUMBERS_MENU() {
    return [
      {
        text: "1",
        value: "1",
      },
      {
        text: "2",
        value: "2",
      },
      {
        text: "3",
        value: "3",
      },
      {
        text: "4",
        value: "4",
      },
      {
        text: "5",
        value: "5",
      },
      {
        text: "6",
        value: "6",
      },
      {
        text: "7",
        value: "7",
      },
      {
        text: "8",
        value: "8",
      },
      {
        text: "9",
        value: "9",
      },
      {
        text: "10",
        value: "10",
      },
    ];
  }

  get PARTS_MENU() {
    return [
      {
        text: Message.nose[this.locale],
        value: "0",
      },
      {
        text: Message.leftEye[this.locale],
        value: "1",
      },
      {
        text: Message.rightEye[this.locale],
        value: "2",
      },
      {
        text: Message.leftEar[this.locale],
        value: "3",
      },
      {
        text: Message.rightEar[this.locale],
        value: "4",
      },
      {
        text: Message.leftShoulder[this.locale],
        value: "5",
      },
      {
        text: Message.rightShoulder[this.locale],
        value: "6",
      },
      {
        text: Message.leftElbow[this.locale],
        value: "7",
      },
      {
        text: Message.rightElbow[this.locale],
        value: "8",
      },
      {
        text: Message.leftWrist[this.locale],
        value: "9",
      },
      {
        text: Message.rightWrist[this.locale],
        value: "10",
      },
      {
        text: Message.leftHip[this.locale],
        value: "11",
      },
      {
        text: Message.rightHip[this.locale],
        value: "12",
      },
      {
        text: Message.leftKnee[this.locale],
        value: "13",
      },
      {
        text: Message.rightKnee[this.locale],
        value: "14",
      },
      {
        text: Message.leftAnkle[this.locale],
        value: "15",
      },
      {
        text: Message.rightAnkle[this.locale],
        value: "16",
      },
    ];
  }

  get VIDEO_MENU() {
    return [
      {
        text: Message.off[this.locale],
        value: "off",
      },
      {
        text: Message.on[this.locale],
        value: "on",
      },
      {
        text: Message.video_on_flipped[this.locale],
        value: "on-flipped",
      },
    ];
  }

  constructor(runtime) {
    this.runtime = runtime;
    if (runtime.formatMessage) {
      // Replace 'formatMessage' to a formatter which is used in the runtime.
      formatMessage = runtime.formatMessage;
    }

    this.poses = [];
    this.keypoints = [];
    this.videoEnabled = false;
    this.locale = this.setLocale();

    let detectPose = () => {
      this.video = this.runtime.ioDevices.video.provider.video;
      this.video.width = 480;
      this.video.height = 360;
      this.video.autoplay = true;
      this.videoEnabled = true;

      this.poseNet = ml5.poseNet(this.video, { maxPoseDetections: 10 }, () => {
        console.log("Model Loaded!");
      });

      this.poseNet.on("pose", (poses) => {
        if (poses.length > 0 && this.videoEnabled) {
          this.poses = poses;
          this.keypoints = poses[0].pose.keypoints;
        } else {
          this.poses = [];
          this.keypoints = [];
        }
      });
    };

    this.runtime.ioDevices.video.enableVideo().then(detectPose);
  }

  getInfo() {
    this.locale = this.setLocale();

    return [
      {
        id: "posenet2scratch",
        name: "Posenet2Scratch",
        extensionURL: Scratch3Posenet2ScratchBlocks.extensionURL,
        blockIconURI: blockIconURI,
        blocks: [
          {
            opcode: "getX",
            blockType: BlockType.REPORTER,
            text: Message.getX[this.locale],
            arguments: {
              PERSON_NUMBER: {
                type: ArgumentType.STRING,
                menu: "personNumbers",
                defaultValue: "1",
              },
              PART: {
                type: ArgumentType.STRING,
                menu: "parts",
                defaultValue: "0",
              },
            },
          },
          {
            opcode: "getY",
            blockType: BlockType.REPORTER,
            text: Message.getY[this.locale],
            arguments: {
              PERSON_NUMBER: {
                type: ArgumentType.STRING,
                menu: "personNumbers",
                defaultValue: "1",
              },
              PART: {
                type: ArgumentType.STRING,
                menu: "parts",
                defaultValue: "0",
              },
            },
          },
          {
            opcode: "getPeopleCount",
            blockType: BlockType.REPORTER,
            text: Message.peopleCount[this.locale],
          },
          {
            opcode: "getNoseX",
            blockType: BlockType.REPORTER,
            text: Message.nose[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getNoseY",
            blockType: BlockType.REPORTER,
            text: Message.nose[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "getLeftEyeX",
            blockType: BlockType.REPORTER,
            text: Message.leftEye[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getLeftEyeY",
            blockType: BlockType.REPORTER,
            text: Message.leftEye[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "getRightEyeX",
            blockType: BlockType.REPORTER,
            text: Message.rightEye[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getRightEyeY",
            blockType: BlockType.REPORTER,
            text: Message.rightEye[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "getLeftEarX",
            blockType: BlockType.REPORTER,
            text: Message.leftEar[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getLeftEarY",
            blockType: BlockType.REPORTER,
            text: Message.leftEar[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "getRightEarX",
            blockType: BlockType.REPORTER,
            text: Message.rightEar[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getRightEarY",
            blockType: BlockType.REPORTER,
            text: Message.rightEar[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "getLeftShoulderX",
            blockType: BlockType.REPORTER,
            text: Message.leftShoulder[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getLeftShoulderY",
            blockType: BlockType.REPORTER,
            text: Message.leftShoulder[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "getRightShoulderX",
            blockType: BlockType.REPORTER,
            text: Message.rightShoulder[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getRightShoulderY",
            blockType: BlockType.REPORTER,
            text: Message.rightShoulder[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "getLeftElbowX",
            blockType: BlockType.REPORTER,
            text: Message.leftElbow[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getLeftElbowY",
            blockType: BlockType.REPORTER,
            text: Message.leftElbow[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "getRightElbowX",
            blockType: BlockType.REPORTER,
            text: Message.rightElbow[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getRightElbowY",
            blockType: BlockType.REPORTER,
            text: Message.rightElbow[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "getLeftWristX",
            blockType: BlockType.REPORTER,
            text: Message.leftWrist[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getLeftWristY",
            blockType: BlockType.REPORTER,
            text: Message.leftWrist[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "getRightWristX",
            blockType: BlockType.REPORTER,
            text: Message.rightWrist[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getRightWristY",
            blockType: BlockType.REPORTER,
            text: Message.rightWrist[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "getLeftHipX",
            blockType: BlockType.REPORTER,
            text: Message.leftHip[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getLeftHipY",
            blockType: BlockType.REPORTER,
            text: Message.leftHip[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "getRightHipX",
            blockType: BlockType.REPORTER,
            text: Message.rightHip[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getRightHipY",
            blockType: BlockType.REPORTER,
            text: Message.rightHip[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "getLeftKneeX",
            blockType: BlockType.REPORTER,
            text: Message.leftKnee[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getLeftKneeY",
            blockType: BlockType.REPORTER,
            text: Message.leftKnee[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "getRightKneeX",
            blockType: BlockType.REPORTER,
            text: Message.rightKnee[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getRightKneeY",
            blockType: BlockType.REPORTER,
            text: Message.rightKnee[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "getLeftAnkleX",
            blockType: BlockType.REPORTER,
            text: Message.leftAnkle[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getLeftAnkleY",
            blockType: BlockType.REPORTER,
            text: Message.leftAnkle[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "getRightAnkleX",
            blockType: BlockType.REPORTER,
            text: Message.rightAnkle[this.locale] + Message.x[this.locale],
          },
          {
            opcode: "getRightAnkleY",
            blockType: BlockType.REPORTER,
            text: Message.rightAnkle[this.locale] + Message.y[this.locale],
          },
          {
            opcode: "videoToggle",
            blockType: BlockType.COMMAND,
            text: Message.videoToggle[this.locale],
            arguments: {
              VIDEO_STATE: {
                type: ArgumentType.STRING,
                menu: "videoMenu",
                defaultValue: "off",
              },
            },
          },
          {
            opcode: "setVideoTransparency",
            text: formatMessage({
              id: "videoSensing.setVideoTransparency",
              default: "set video transparency to [TRANSPARENCY]",
              description: "Controls transparency of the video preview layer",
            }),
            arguments: {
              TRANSPARENCY: {
                type: ArgumentType.NUMBER,
                defaultValue: 50,
              },
            },
          },
        ],
        menus: {
          personNumbers: {
            acceptReporters: true,
            items: this.PERSON_NUMBERS_MENU,
          },
          parts: {
            acceptReporters: true,
            items: this.PARTS_MENU,
          },
          videoMenu: {
            acceptReporters: false,
            items: this.VIDEO_MENU,
          },
        },
      },
    ];
  }

  getX(args) {
    if (
      this.poses[parseInt(args.PERSON_NUMBER, 10) - 1] &&
      this.poses[parseInt(args.PERSON_NUMBER, 10) - 1].pose.keypoints[
        parseInt(args.PART, 10)
      ]
    ) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return (
          -1 *
          (240 -
            this.poses[parseInt(args.PERSON_NUMBER, 10) - 1].pose.keypoints[
              parseInt(args.PART, 10)
            ].position.x)
        );
      } else {
        return (
          240 -
          this.poses[parseInt(args.PERSON_NUMBER, 10) - 1].pose.keypoints[
            parseInt(args.PART, 10)
          ].position.x
        );
      }
    } else {
      return "";
    }
  }

  getY(args) {
    if (
      this.poses[parseInt(args.PERSON_NUMBER, 10) - 1] &&
      this.poses[parseInt(args.PERSON_NUMBER, 10) - 1].pose.keypoints[
        parseInt(args.PART, 10)
      ]
    ) {
      return (
        180 -
        this.poses[parseInt(args.PERSON_NUMBER, 10) - 1].pose.keypoints[
          parseInt(args.PART, 10)
        ].position.y
      );
    } else {
      return "";
    }
  }

  getPeopleCount() {
    return this.poses.length;
  }

  getNoseX() {
    if (this.keypoints[0]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[0].position.x);
      } else {
        return 240 - this.keypoints[0].position.x;
      }
    } else {
      return "";
    }
  }

  getNoseY() {
    if (this.keypoints[0]) {
      return 180 - this.keypoints[0].position.y;
    } else {
      return "";
    }
  }

  getLeftEyeX() {
    if (this.keypoints[1]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[1].position.x);
      } else {
        return 240 - this.keypoints[1].position.x;
      }
    } else {
      return "";
    }
  }

  getLeftEyeY() {
    if (this.keypoints[1]) {
      return 180 - this.keypoints[1].position.y;
    } else {
      return "";
    }
  }

  getRightEyeX() {
    if (this.keypoints[2]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[2].position.x);
      } else {
        return 240 - this.keypoints[2].position.x;
      }
    } else {
      return "";
    }
  }

  getRightEyeY() {
    if (this.keypoints[2]) {
      return 180 - this.keypoints[2].position.y;
    } else {
      return "";
    }
  }

  getLeftEarX() {
    if (this.keypoints[3]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[3].position.x);
      } else {
        return 240 - this.keypoints[3].position.x;
      }
    } else {
      return "";
    }
  }

  getLeftEarY() {
    if (this.keypoints[3]) {
      return 180 - this.keypoints[3].position.y;
    } else {
      return "";
    }
  }

  getRightEarX() {
    if (this.keypoints[4]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[4].position.x);
      } else {
        return 240 - this.keypoints[4].position.x;
      }
    } else {
      return "";
    }
  }

  getRightEarY() {
    if (this.keypoints[4]) {
      return 180 - this.keypoints[4].position.y;
    } else {
      return "";
    }
  }

  getLeftShoulderX() {
    if (this.keypoints[5]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[5].position.x);
      } else {
        return 240 - this.keypoints[5].position.x;
      }
    } else {
      return "";
    }
  }

  getLeftShoulderY() {
    if (this.keypoints[5]) {
      return 180 - this.keypoints[5].position.y;
    } else {
      return "";
    }
  }

  getRightShoulderX() {
    if (this.keypoints[6]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[6].position.x);
      } else {
        return 240 - this.keypoints[6].position.x;
      }
    } else {
      return "";
    }
  }

  getRightShoulderY() {
    if (this.keypoints[6]) {
      return 180 - this.keypoints[6].position.y;
    } else {
      return "";
    }
  }

  getLeftElbowX() {
    if (this.keypoints[7]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[7].position.x);
      } else {
        return 240 - this.keypoints[7].position.x;
      }
    } else {
      return "";
    }
  }

  getLeftElbowY() {
    if (this.keypoints[7]) {
      return 180 - this.keypoints[7].position.y;
    } else {
      return "";
    }
  }

  getRightElbowX() {
    if (this.keypoints[8]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[8].position.x);
      } else {
        return 240 - this.keypoints[8].position.x;
      }
    } else {
      return "";
    }
  }

  getRightElbowY() {
    if (this.keypoints[8]) {
      return 180 - this.keypoints[8].position.y;
    } else {
      return "";
    }
  }

  getLeftWristX() {
    if (this.keypoints[9]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[9].position.x);
      } else {
        return 240 - this.keypoints[9].position.x;
      }
    } else {
      return "";
    }
  }

  getLeftWristY() {
    if (this.keypoints[9]) {
      return 180 - this.keypoints[9].position.y;
    } else {
      return "";
    }
  }

  getRightWristX() {
    if (this.keypoints[10]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[10].position.x);
      } else {
        return 240 - this.keypoints[10].position.x;
      }
    } else {
      return "";
    }
  }

  getRightWristY() {
    if (this.keypoints[10]) {
      return 180 - this.keypoints[10].position.y;
    } else {
      return "";
    }
  }

  getLeftHipX() {
    if (this.keypoints[11]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[11].position.x);
      } else {
        return 240 - this.keypoints[11].position.x;
      }
    } else {
      return "";
    }
  }

  getLeftHipY() {
    if (this.keypoints[11]) {
      return 180 - this.keypoints[11].position.y;
    } else {
      return "";
    }
  }

  getRightHipX() {
    if (this.keypoints[12]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[12].position.x);
      } else {
        return 240 - this.keypoints[12].position.x;
      }
    } else {
      return "";
    }
  }

  getRightHipY() {
    if (this.keypoints[12]) {
      return 180 - this.keypoints[12].position.y;
    } else {
      return "";
    }
  }

  getLeftKneeX() {
    if (this.keypoints[13]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[13].position.x);
      } else {
        return 240 - this.keypoints[13].position.x;
      }
    } else {
      return "";
    }
  }

  getLeftKneeY() {
    if (this.keypoints[13]) {
      return 180 - this.keypoints[13].position.y;
    } else {
      return "";
    }
  }

  getRightKneeX() {
    if (this.keypoints[14]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[14].position.x);
      } else {
        return 240 - this.keypoints[14].position.x;
      }
    } else {
      return "";
    }
  }

  getRightKneeY() {
    if (this.keypoints[14]) {
      return 180 - this.keypoints[14].position.y;
    } else {
      return "";
    }
  }

  getLeftAnkleX() {
    if (this.keypoints[15]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[15].position.x);
      } else {
        return 240 - this.keypoints[15].position.x;
      }
    } else {
      return "";
    }
  }

  getLeftAnkleY() {
    if (this.keypoints[15]) {
      return 180 - this.keypoints[15].position.y;
    } else {
      return "";
    }
  }

  getRightAnkleX() {
    if (this.keypoints[16]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.keypoints[16].position.x);
      } else {
        return 240 - this.keypoints[16].position.x;
      }
    } else {
      return "";
    }
  }

  getRightAnkleY() {
    if (this.keypoints[16]) {
      return 180 - this.keypoints[16].position.y;
    } else {
      return "";
    }
  }

  videoToggle(args) {
    let state = args.VIDEO_STATE;
    if (state === "off") {
      this.globalVideoTransparency = 100;
      this.runtime.ioDevices.video.setPreviewGhost(100);
      this.videoEnabled = false;
    } else {
      this.globalVideoTransparency = 0;
      this.runtime.ioDevices.video.setPreviewGhost(0);
      this.runtime.ioDevices.video.mirror = state === "on";
      this.videoEnabled = true;
    }
  }

  /**
   * A scratch command block handle that configures the video preview's
   * transparency from passed arguments.
   * @param {object} args - the block arguments
   * @param {number} args.TRANSPARENCY - the transparency to set the video
   *   preview to
   */
  setVideoTransparency(args) {
    const transparency = Cast.toNumber(args.TRANSPARENCY);
    this.globalVideoTransparency = transparency;
    this.runtime.ioDevices.video.setPreviewGhost(transparency);
  }

  setLocale() {
    let locale = formatMessage.setup().locale;
    if (AvailableLocales.includes(locale)) {
      return locale;
    } else {
      return "en";
    }
  }
}

exports.blockClass = Scratch3Posenet2ScratchBlocks;
module.exports = Scratch3Posenet2ScratchBlocks;
