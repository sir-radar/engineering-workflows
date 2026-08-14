# Failure artifact interpretation

| Diff shape | Likely cause | First check |
| --- | --- | --- |
| Widespread text halos | Font, weight, antialiasing, scale | Font readiness and pinned environment |
| Whole page shifted | Viewport, scrollbar, body margin, header height | Frame and document geometry |
| Repeated small offsets | Token or line-height drift | Computed styles and design variables |
| One volatile region | Time, random data, animation, network | Fixture and readiness controls |
| Color-only field | Theme, color profile, opacity | Media emulation and computed color |
| Lower page diverges progressively | Earlier height or wrapping error | First vertical divergence |
| Baseline passes locally only | Browser or OS mismatch | Project name and CI image |

Inspect actual, expected, and diff together. Start at the earliest structural divergence; downstream pixels often reflect one upstream geometry error.
