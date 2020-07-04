(function() {

    const getData = done => {

        const cacheName = 'belzy-fcc-treemap-data-cache';
        const cacheExpiry = 1800000; // 30 minutes in milliseconds.
        const currentTime = new Date().getTime();
        let cache = JSON.parse(localStorage.getItem(cacheName));
        const resources = [
            'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
        ];
        const init = {
            method: 'GET',
        };

        if (cache === null || cache['expiration'] <= currentTime) {
        
            if (cache === null) console.log('Cache doesn\'t exist. Creating new cache...');
            else if (cache['expiration'] <= currentTime) console.log('Cache has expired. Updating cache...');

            fetch(resources[0], init)
                .then(response => response.json())
                .then(data => {

                    cache = { expiration: currentTime + cacheExpiry, data };
                    localStorage.setItem(cacheName, JSON.stringify(cache));
                    done(data);

                }).catch(err => console.log(err));

        } else {

            console.log('Using cached data...')
            done(cache['data']);

        }

    };

    getData(data => {

        const platformArr = data['children'].map(platform => platform['name']);
        const colorArr = ['#4C92C3', '#FFC993', '#DE5253', '#D1C0DD', '#E992CE', '#D2D2D2', '#BED2ED', '#56B356', '#FFADAB', '#A3786F', '#F9C5DB', '#C9CA4E', '#FF993E', '#ADE5A1', '#A985CA', '#D0B0A9', '#999999', '#E2E2A4'];

        const w = 960;
        const h = 570;
        // const w = 1200;
        // const h = 600;
        const padding = 2;

        // Color scale.
        const colorScale = d3.scaleOrdinal()
            .domain(platformArr)
            .range(colorArr);

        const root = d3.hierarchy(data)
            .sum(d => d.value).sort((a, b) => b.value - a.value);

        const treemap = d3.treemap()
            .size([w, h])(root);

        const svg = d3.select('svg')
            .attr('width', w)
            .attr('height', h)

        const node = svg.selectAll('g')
            .data(treemap.leaves())
            .enter()
            .append('g')
            .attr('transform', d => `translate(${ d.x0 }, ${ d.y0 })`)

        node.append('rect')
            .attr('class', 'tile')
            .attr('data-name', d => d['data']['name'])
            .attr('data-category', d => d['data']['category'])
            .attr('data-value', d => d['data']['value'])
            .attr('fill', d => colorScale(d['data']['category']))
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)

        node.append('text')
            .selectAll('tspan')
            .data(d => d['data']['name'].split(' '))
            .enter()
            .append('tspan')
            .attr('x', 4)
            .attr('y', (d, i) => 14 + (i * 12))
            .text(d => d)
   
    });

})();