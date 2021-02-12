(function() {

let links
    , nodes
    , simulation = d3.forceSimulation()
    , width = +svg.node().getBoundingClientRect().width
    , height = +svg.node().getBoundingClientRect().height;

d3.select(window).on("resize", function () {
    width = +svg.node().getBoundingClientRect().width;
    height = +svg.node().getBoundingClientRect().height;
    updateForces();
});

initializeDisplay();
initializeSimulation();

/**
 * Set up the simulation and event to update locations after each tick
 */

function initializeSimulation() {
    simulation.nodes(graph.nodes);
    initializeForces();
    simulation.on("tick", ticked);
}

/**
 * Set the forces to the simulation
 */

function initializeForces() {
    // add forces and associate each with a name
    simulation
        .force("link", d3.forceLink())
        .force("charge", d3.forceManyBody())
        .force("collide", d3.forceCollide())
        .force("center", d3.forceCenter())
        .force("forceX", d3.forceX())
        .force("forceY", d3.forceY());
    // apply properties to each of the forces
    updateForces();
}

/**
 * Update the forces to the simulation
 */

function updateForces() {
    // get each force by name and update the properties

    // forceProperties = graph config

    simulation.force("center")
        .x(width * forceProperties.center.x)
        .y(height * forceProperties.center.y);

    simulation.force("charge")
        .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
        .distanceMin(forceProperties.charge.distanceMin)
        .distanceMax(forceProperties.charge.distanceMax);

    simulation.force("collide")
        .strength(forceProperties.collide.strength * forceProperties.collide.enabled)
        .radius(forceProperties.collide.radius)
        .iterations(forceProperties.collide.iterations);

    simulation.force("forceX")
        .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
        .x(width * forceProperties.forceX.x);

    simulation.force("forceY")
        .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
        .y(height * forceProperties.forceY.y);

    simulation.force("link")
        .id((d) => d.id)
        .distance(forceProperties.link.distance)
        .iterations(forceProperties.link.iterations)
        .links(forceProperties.link.enabled ? graph.links : []);

    // restarts the simulation (important if simulation has already slowed down)
    simulation.alpha(1).restart();
}

window.updateForces = updateForces;

/**
 * Initialize visualisation
 */

function initializeDisplay() {

    // set the data and properties of link lines
    link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line");

    // set the data and properties of node circles
    node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .on('click', function(nodeMetas) {
            openRecord(nodeMetas.id);
        })
        .call(d3.drag()
            .on("start", function(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y; })
            .on("drag", function(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y; })
            .on("end", function(d) {
                if (!d3.event.active) simulation.alphaTarget(0.0001);
                d.fx = null;
                d.fy = null;
            }));
    
    link.attr("data-source", (d) => d.source)
        .attr("data-target", (d) => d.target)
        .attr("class", (d) => 'l_' + d.type);

    // node class
    node.attr("class", (d) => "t_" + d.type)
        .attr("data-node", (d) => d.id);

    let tip = undefined;

    node.on("mouseover", function (d) {

        tip = svg.append("g")
            .attr("transform", "translate(" + d.x + "," + d.y + ")");

        var rect = tip.append("rect")
            .style("fill", "white")
            .attr("class", "t_" + d.type)
            .attr("rx", 2)
            .attr("ry", 2);
        
        tip.append("text")
            .text(d.type)
            .attr("dy", "1.5em")
            .attr("x", 5)
            .attr("class", "tip_type");

        tip.append("text")
            .text(d.label)
            .attr("dy", "1.8em")
            .attr("x", 5)
            .attr("class", "tip_title");

        const bbox = tip.node().getBBox();
        rect.attr("width", bbox.width + 20)
            .attr("height", bbox.height + 14);

        tip.attr("transform", "translate(" + (d.x - ((bbox.width + 10) / 2)) + "," + (d.y - (bbox.height + 20)) + ")")
    });

    node.on("mouseout", function (d) {
        if (tip) tip.remove();
    });
}

/**
 * Update elements position
 */

function ticked() {
    link.attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => d.size * forceProperties.node.sizeCoeff);

    d3.select('#alpha_value').style('flex-basis', (simulation.alpha() * 100) + '%');
}

})();