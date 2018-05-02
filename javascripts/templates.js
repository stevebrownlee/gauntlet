Gauntlet = function (global) {
    const Templates = Object.create(gutil.ObjectExtensions, {
        init: {
            value: function () {
                return this
            },
        },
        weaponList: {
            value: function (weapons) {
                return gutil.html`
                    <div class="row weapons">
                        ${
                            [...weapons].map(
                                (weapon, i) => (i % 3)
                                    ? this.weaponCard(weapon, Gauntlet.Armory.weapons.find(w => w.id === weapon).toString())
                                    : '</div><div class="row weapons">'
                            )
                        }
                    </div>
                `
            }
        },
        weaponCard: {
            value: function (normalized, readable) {
                return gutil.html`
                    <div class="col-sm-6">
                        <div class="card__button">
                            <a class="weapon__link btn btn--big btn--orange" href="#">
                                <span class="btn__prompt">&gt</span>
                                <span class="btn__text weapon__name" weapon=${normalized}>${readable}</span>
                            </a>
                        </div>
                    </div>
                `
            }
        }
    })


    global.HTMLTemplates = Templates.init()
    return global

}(Gauntlet || {})
