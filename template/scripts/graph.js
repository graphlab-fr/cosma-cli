    //////////// FORCE SIMULATION //////////// 

    // force simulator
    var svg = d3.select("#graph_canvas"),
    width = +svg.node().getBoundingClientRect().width,
    height = +svg.node().getBoundingClientRect().height;

    var link, node;
    var simulation = d3.forceSimulation();

    // set up the simulation and event to update locations after each tick
    function initializeSimulation() {
        simulation.nodes(graph.nodes);
        initializeForces();
        simulation.on("tick", ticked);
    }

    // add forces to the simulation
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

    // apply new force properties
    function updateForces() {
        // get each force by name and update the properties
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
            .id(function (d) {
                return d.id;
            })
            .distance(forceProperties.link.distance)
            .iterations(forceProperties.link.iterations)
            .links(forceProperties.link.enabled ? graph.links : []);

        // updates ignored until this is run
        // restarts the simulation (important if simulation has already slowed down)
        simulation.alpha(1).restart();
    }



    //////////// DISPLAY ////////////

    // generate the svg objects and force simulation
    function initializeDisplay(filter = undefined) {

        svg.selectAll('g').remove();

        let filteredData;

        if (filter !== undefined) {
            filteredData = {nodes: [], links: []};
            let contextNode = [];
            
            for (const elt of graph.nodes) {
    
                if (elt.type === filter) {
                    filteredData.nodes.push(elt);
                    contextNode.push(elt.id);
                }
            }
            
            for (const elt of graph.links) {

                if (elt.source.type === filter && elt.target.type === filter) {
                    filteredData.links.push(elt);
                }
            }
        } else {
            filteredData = graph;
        }

        // set the data and properties of link lines
        link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(filteredData.links)
            .enter().append("line");

        // set the data and properties of node circles
        node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(filteredData.nodes)
            .enter().append("circle")
            // .filter(function(nodeMetas) {
            //     if (nodeMetas.type !== 'référentiel') {
            //         return false; }

            //     return nodeMetas
            // })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.on('click', function(nodeMetas) {
            openRecord(nodeMetas.id);
        })

        // node tooltip
        node.append("title")
            .text(function (d) {
                return d.id;
            });
        
        // node class
        node.attr("class", function (d) {
            return "t_" + d.type;
        });


        var tip;
        node.on("mouseover", function (d) {
            if (tip) tip.remove();

            tip = svg.append("g")
                .attr("transform", "translate(" + d.x + "," + d.y + ")");

            var rect = tip.append("rect")
                .style("fill", "white")
                .attr("class", "t_" + d.type)
                .attr("rx", 2)
                .attr("ry", 2);
            
            tip.append("text")
                .text(d.type) /* Type */
                .attr("dy", "1.5em")
                .attr("x", 5)
                .attr("class", "tip_type");

            tip.append("text")
                .text(d.label) /* Titre */
                .attr("dy", "1.8em")
                .attr("x", 5)
                .attr("class", "tip_title");


            

            /*var con = graph.links
                .filter(function (d1) {
                    return d1.source.id === d.id;
                })
                .map(function (d1) {
                    return d1.target.name + " with weight " + d1.weight;
                })

            tip.append("text")
                .text("Connected to: " + con.join(","))
                .attr("dy", "3em")
                .attr("x", 5);
            */

            var bbox = tip.node().getBBox();
            rect.attr("width", bbox.width + 20)
                .attr("height", bbox.height + 14);

            tip.attr("transform", "translate(" + (d.x - ((bbox.width + 10) / 2)) + "," + (d.y - (bbox.height + 20)) + ")")
        });
        node.on("mouseout", function (d) {
            if (tip) tip.remove();
        });

        // visualize the graph
        updateDisplay();
    }

    // update the display based on the forces (but not positions)
    function updateDisplay() {
        node
            //.attr("r", forceProperties.collide.radius)
        //.attr("stroke", forceProperties.charge.strength > 0 ? "blue" : "red")
        //.attr("stroke-width", forceProperties.charge.enabled == false ? 0 : Math.abs(forceProperties.charge.strength) / 15);

        link
            .attr("stroke-width", forceProperties.link.enabled ? 1 : .5)
            .attr("opacity", forceProperties.link.enabled ? 1 : 0);
    }

    // update the display positions after each simulation tick
    function ticked() {

        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("r", function (d) {
            		return d.size * forceProperties.node.sizeCoeff;
        		});
        d3.select('#alpha_value').style('flex-basis', (simulation.alpha() * 100) + '%');
    }



    //////////// UI EVENTS ////////////

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0.0001);
        d.fx = null;
        d.fy = null;
    }

    // update size-related forces
    d3.select(window).on("resize", function () {
        width = +svg.node().getBoundingClientRect().width;
        height = +svg.node().getBoundingClientRect().height;
        updateForces();
    });

    // convenience function to update everything (run after UI input)
    function updateAll() {
        updateForces();
        updateDisplay();
    }
