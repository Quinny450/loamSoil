Game.registerMod('loamSoil', {
    init: function () {
        // Wait for the Garden minigame to load
        if (!Game.Objects['Farm'].minigame) {
            Game.registerHook('create', () => this.init());
            return;
        }
        const M = Game.Objects['Farm'].minigame;

        // Add Loam soil to the soils array if not already present
        if (!M.soils.some((soil) => soil.name === 'Loam')) {
            M.soils.push({
                name: 'Loam',
                desc: 'Balanced soil that spreads nutrients and water evenly among crops.',
                icon: [0, 0, 'loamSoil'], // Uses thumbnail.png as the icon
                tick: 7 * 60, // 7 minutes in seconds
                weedMult: 1,
                effectMult: 0.8, // -20% passive plant effects
                onPlantTick: function (me, soil) {
                    // Predictable growth: always grow by the average amount
                    if (me && me.age < me.mature) {
                        let avgGrowth =
                            (me.plant.growthMin + me.plant.growthMax) / 2;
                        me.age += avgGrowth;
                    }
                },
                eff: function () {
                    return (
                        '<div style="color: #6f6;">Gives every crop in your garden predictable growth</div>' +
                        '<div style="color: #f44;">Passive plant effects -20%</div>'
                    );
                },
            });

            // Add Loam to the soil unlocks (so it's available immediately)
            M.soilMults.push(1);

            // Add Loam to the soil names for display
            M.soilNames.push('Loam');

            // Add Loam to the soil tooltips
            M.soilTooltips.push(
                '<b>Loam</b><br>Tick every 7 minutes.<br>' +
                    '<span style="color: #6f6;">Gives every crop in your garden predictable growth</span><br>' +
                    '<span style="color: #f44;">Passive plant effects -20%</span><br>' +
                    '<i>Balanced soil that spreads nutrients and water evenly among crops.</i>'
            );
        }

        // Hook into the plant tick to apply predictable growth when Loam is active
        const originalPlantTick = M.plantTick;
        M.plantTick = function (me, soil) {
            // If Loam is active, use its onPlantTick
            if (M.soil === M.soils.length - 1) {
                // Last soil is Loam
                M.soils[M.soils.length - 1].onPlantTick(me, soil);
            } else {
                // Otherwise, use the original
                originalPlantTick.call(M, me, soil);
            }
        };

        // Log to console
        Game.Notify('Loam soil mod loaded!', '', [0, 0, 'loamSoil']);
    },
});