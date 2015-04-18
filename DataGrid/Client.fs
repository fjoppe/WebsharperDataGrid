namespace DataGrid

open WebSharper
open WebSharper.Html.Client
open WebSharper.JavaScript
open System


[<JavaScript>]
module Client =
    let columns = [0..7] |> List.map(fun i -> sprintf "C%d" i)
    let rows    = 8

    //  window.clipboardData is missing in Websharper 3.0.46.130-rc, so make a custom binding here
    type Window with
        [<Inline "$0.clipboardData">]
        member this.ClipboardData = X<DataTransfer>

    let grid = Array2D.init columns.Length rows (fun x y -> Input[Attr.Type "Text"])

    let getCoordinates node =
        [0 .. (columns.Length-1)] |> List.tryPick(fun c ->
            [0.. (rows-1)] |> List.tryPick(fun r ->
                if grid.[c,r].Body = node then Some(c,r)
                else None
            )
        )

    let doPaste (e:Dom.Event) = 
        let event = As<ClipboardEvent>(e)
        let targetNode = As<Dom.Node>(event.Target)
                            
        let data = if event.ClipboardData <> JS.Undefined then event.ClipboardData.GetData("text/plain") // Chrome / FF
                   else JS.Window.ClipboardData.GetData("text")     // IE

        event.PreventDefault()  // don't want normal paste

        targetNode |> getCoordinates 
                   |> function
                      | None      ->  ignore 0
                      | Some(xorg,yorg) ->  
                            data.Split([|'\n'|], StringSplitOptions.RemoveEmptyEntries)         // split into lines
                                |> List.ofArray
                                |> List.iteri (fun ypaste row ->
                                    row.Split([|'\t'|], StringSplitOptions.RemoveEmptyEntries)  // split into columns
                                        |> List.ofArray
                                        |> List.iteri(fun xpaste text -> 
                                            let xtarget, ytarget = xorg + xpaste, yorg + ypaste
                                            if (xtarget < columns.Length) && (ytarget < rows)
                                            then
                                                grid.[xtarget, ytarget].Value <- text    // copy it into the cell
                                        )
                                    )

    let Main =
        Div[
            // create simple table grid
            Table[
                yield TR[ yield! columns |> List.map(fun e -> TH[Text <| e]) ]
                for r in [0..(rows-1)] do
                    yield TR[
                        for c in [0..(columns.Length-1)] do
                            let inputBox = grid.[c,r]
                            inputBox.Body.AddEventListener("paste", doPaste, false)
                            yield TD[inputBox]
                    ]                
            ]
        ] |> fun el -> el.AppendTo "grid"

