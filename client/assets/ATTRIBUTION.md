# Asset Attribution

This game uses placeholder graphics and sounds. For production use, replace with actual assets.

## Recommended Free Asset Sources:

### Graphics:
- **Kenney.nl** - https://kenney.nl/assets
  - Top-down shooters pack
  - Platformer pack
  - UI pack
  - License: CC0 (Public Domain)

- **OpenGameArt.org** - https://opengameart.org/
  - Character sprites
  - Weapons
  - Effects
  - License: Various (check individual assets)

- **itch.io** - https://itch.io/game-assets/free
  - Many free game assets
  - License: Various (check individual assets)

### Sounds:
- **Freesound.org** - https://freesound.org/
  - Gun sounds
  - Impact sounds
  - UI sounds
  - License: CC (check individual sounds)

- **OpenGameArt.org** - Audio section
  - Sound effects
  - Music
  - License: Various

### Music:
- **Incompetech** - https://incompetech.com/music/
  - Background music
  - License: CC BY (attribution required)

- **FreePD** - https://freepd.com/
  - Public domain music
  - License: Public Domain

## How to Add Assets:

1. Download assets from above sources
2. Place sprites in `client/assets/sprites/`
3. Place sounds in `client/assets/sounds/`
4. Update asset loading in `client/src/scenes/BootScene.ts`
5. Update texture keys in `shared/src/constants.ts`

## Current Placeholders:

All current graphics are simple colored shapes generated programmatically:
- Players: Green/red rectangles
- Bullets: Yellow circles
- Platforms: Gray/brown rectangles
- Effects: Colored particles

These should be replaced with actual sprite sheets for production use.

## Attribution Template:

When you add assets, update this section:

```
Asset Name: [Name]
Author: [Author]
Source: [URL]
License: [License Type]
Changes: [Any modifications made]
```

## License Compliance:

Make sure to:
1. Check license requirements for each asset
2. Provide attribution where required
3. Keep this file updated with asset credits
4. Include license files if required

Remember: Respect creators and follow license terms! 🎨🎵
